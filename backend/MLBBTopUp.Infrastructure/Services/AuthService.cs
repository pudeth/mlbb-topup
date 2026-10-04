using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Entities;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MLBBTopUp.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> RegisterAsync(RegisterRequest request)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        // Check if email already exists
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (existingUser != null)
        {
            return null; // Email already registered
        }

        // Validate password strength (supports min 4 chars for Server ID)
        if (request.Password.Length < 4)
        {
            return null; // Password too short
        }

        // Create new user
        var user = new User
        {
            Name = request.Name,
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(user.UserId, user.Email, user.Role);

        return new LoginResponse
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Token = token
        };
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        var lookup = request.Email.Trim().ToLower();

        // Find user by email or by username/real-name
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == lookup || u.Name.ToLower() == lookup);

        if (user == null)
        {
            return null; // User not found
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null; // Invalid password
        }

        // Generate JWT token
        var token = GenerateJwtToken(user.UserId, user.Email, user.Role);

        return new LoginResponse
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Token = token
        };
    }

    /// <summary>
    /// Player account sync & login: uses real-name player = username and ID server = password
    /// </summary>
    public async Task<LoginResponse?> PlayerAuthAsync(PlayerAuthRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PlayerId) || string.IsNullOrWhiteSpace(request.ServerId))
        {
            return null;
        }

        var pId = request.PlayerId.Trim();
        var sId = request.ServerId.Trim();
        var realName = !string.IsNullOrWhiteSpace(request.RealName) ? request.RealName.Trim() : $"Player_{pId}";
        var email = $"{pId}_{sId}@player.tin-topup.com".ToLower();
        var password = sId;

        // Find existing user by player email or by realName
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email || (u.Name.ToLower() == realName.ToLower() && u.Role == "User"));

        if (user == null)
        {
            // Register new player user account
            // username = real-name player, password = ID server
            user = new User
            {
                Name = realName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            // Keep real-name updated if available
            if (!string.IsNullOrWhiteSpace(request.RealName) && user.Name != realName)
            {
                user.Name = realName;
            }
            // Update password hash to current server ID
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            await _context.SaveChangesAsync();
        }

        // Link all past guest orders matching PlayerID and ServerID to this user
        try
        {
            var unlinkedOrders = await _context.Orders
                .Where(o => o.PlayerID == pId && (string.IsNullOrEmpty(o.ServerID) || o.ServerID == sId) && o.UserId == null)
                .ToListAsync();

            if (unlinkedOrders.Any())
            {
                foreach (var ord in unlinkedOrders)
                {
                    ord.UserId = user.UserId;
                    if (string.IsNullOrEmpty(ord.AccountName) && !string.IsNullOrWhiteSpace(realName))
                    {
                        ord.AccountName = realName;
                    }
                }
                await _context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Auth] Error linking past orders: {ex.Message}");
        }

        // Generate JWT token
        var token = GenerateJwtToken(user.UserId, user.Email, user.Role);

        return new LoginResponse
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Token = token
        };
    }

    public async Task<UserResponse?> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return null;
        }

        return new UserResponse
        {
            UserId = user.UserId,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }

    public string GenerateJwtToken(int userId, string email, string role)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");
        var issuer = jwtSettings["Issuer"] ?? "MLBBTopUpAPI";
        var audience = jwtSettings["Audience"] ?? "MLBBTopUpClient";
        var expiryMinutes = int.Parse(jwtSettings["ExpiryInMinutes"] ?? "60");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
