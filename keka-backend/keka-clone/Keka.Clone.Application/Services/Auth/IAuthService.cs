using Keka.Clone.Application.DTOs.Auth;
using Keka.Clone.Domain.Entities;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshAsync(string refreshToken);
    Task RegisterAsync(RegisterRequest request);
    Task LogoutAsync(string refreshToken);
}
