using Keka.Clone.Domain.Entities;

public interface IJwtService
{
    string GenerateAccessToken(User user, Guid? employeeId = null);
    RefreshToken GenerateRefreshToken();
}
