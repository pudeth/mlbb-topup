using MLBBTopUp.Core.DTOs;

namespace MLBBTopUp.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> RegisterAsync(RegisterRequest request);
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<UserResponse?> GetUserByIdAsync(int userId);
    string GenerateJwtToken(int userId, string email, string role);
}
