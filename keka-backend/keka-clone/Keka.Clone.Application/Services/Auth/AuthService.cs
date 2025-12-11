using Keka.Clone.Application.DTOs.Auth;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.AspNetCore.Identity;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IEmployeeRepository _employees;
    private readonly IJwtService _jwt;
    private readonly PasswordHasher<User> _hasher = new();

    public AuthService(IUserRepository users, IJwtService jwt, IEmployeeRepository employees)
    {
        _users = users;
        _jwt = jwt;
        _employees = employees;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _users.GetByEmailAsync(request.Email);
        if (user == null)
            throw new Exception("Invalid credentials");

        var verify = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            throw new Exception("Invalid credentials");

        var employee = await _employees.GetByWorkEmailAsync(user.Email);
        var accessToken = _jwt.GenerateAccessToken(user, employee);
        var refreshToken = _jwt.GenerateRefreshToken();
        refreshToken.UserId = user.Id;

        await _users.AddRefreshTokenAsync(refreshToken);
        await _users.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public async Task<AuthResponse> RefreshAsync(string refreshToken)
    {
        var token = await _users.GetRefreshTokenAsync(refreshToken);
        if (token == null)
            throw new Exception("Invalid refresh token.");

        var user = await _users.GetByEmailAsync(token.User?.Email!);
        if (user == null)
            throw new Exception("User not found.");

        var employee = await _employees.GetByWorkEmailAsync(user.Email);
        var newAccessToken = _jwt.GenerateAccessToken(user, employee);

        return new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(15)
        };
    }

    public async Task RegisterAsync(RegisterRequest request)
    {
        var exists = await _users.GetByEmailAsync(request.Email);
        if (exists != null)
            throw new Exception("User already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FullName = request.FullName,
            Role = request.Role
        };

        user.PasswordHash = _hasher.HashPassword(user, request.Password);

        await _users.AddAsync(user);
        await _users.SaveChangesAsync();
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var token = await _users.GetRefreshTokenAsync(refreshToken);
        if (token != null)
        {
            await _users.DeleteRefreshTokenAsync(token);
            await _users.SaveChangesAsync();
        }
    }
}
