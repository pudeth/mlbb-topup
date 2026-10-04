namespace MLBBTopUp.Core.DTOs;

public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}

public class UserResponse
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class PlayerAuthRequest
{
    public string PlayerId { get; set; } = string.Empty;
    public string ServerId { get; set; } = string.Empty;
    public string? RealName { get; set; }
}

public class UpdateProfileRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? PlayerId { get; set; }
    public string? ServerId { get; set; }
    public string? PhoneNumber { get; set; }
}
