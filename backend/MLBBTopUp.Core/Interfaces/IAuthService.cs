using MLBBTopUp.Core.DTOs;

namespace MLBBTopUp.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> RegisterAsync(RegisterRequest request);
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<LoginResponse?> PlayerAuthAsync(PlayerAuthRequest request);
    Task<UserResponse?> GetUserByIdAsync(int userId);
    Task<UserResponse?> UpdateProfileAsync(int userId, UpdateProfileRequest request);
    string GenerateJwtToken(int userId, string email, string role);
}
