using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MLBBTopUp.API.Controllers;

public class BaseController : ControllerBase
{
    protected int? GetAuthenticatedUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                          ?? User.FindFirst("sub")?.Value;

        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }

        return null;
    }

    protected string? GetAuthenticatedUserEmail()
    {
        return User.FindFirst(ClaimTypes.Email)?.Value;
    }

    protected string? GetAuthenticatedUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value;
    }

    protected bool IsAdmin()
    {
        var role = GetAuthenticatedUserRole();
        return role?.ToLower() == "admin";
    }
}
