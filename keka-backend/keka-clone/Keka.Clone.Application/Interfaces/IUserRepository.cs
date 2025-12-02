using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
        Task SaveChangesAsync();

        Task AddRefreshTokenAsync(RefreshToken token);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
        Task DeleteRefreshTokenAsync(RefreshToken token);
    }
}
