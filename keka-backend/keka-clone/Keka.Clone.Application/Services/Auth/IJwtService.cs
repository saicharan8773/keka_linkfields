using Keka.Clone.Domain.Entities;

public interface IJwtService
{
    string GenerateAccessToken(User user, Employee? employee = null);
    RefreshToken GenerateRefreshToken();
}
