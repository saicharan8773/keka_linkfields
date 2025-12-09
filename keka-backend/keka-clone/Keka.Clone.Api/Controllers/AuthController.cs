using Keka.Clone.Application.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Keka.Clone.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController:ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
        => Ok(await _auth.LoginAsync(req));

    [HttpPost("register")]
    [Authorize(Roles ="Admin,Manager,HR")]
    public async Task<IActionResult> Register(Application.DTOs.Auth.RegisterRequest req)
    {
        await _auth.RegisterAsync(req);
        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest req)
        => Ok(await _auth.RefreshAsync(req.RefreshToken));

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(RefreshRequest req)
    {
        await _auth.LogoutAsync(req.RefreshToken);
        return Ok();
    }
}
