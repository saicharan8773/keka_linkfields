using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories
{
    public class UserRepository:IUserRepository
    {
        private readonly AppDbContext _db;

        public UserRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task AddAsync(User user)
        {
            await _db.Users.AddAsync(user);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task AddRefreshTokenAsync(RefreshToken token)
        {
            await _db.RefreshTokens.AddAsync(token);
        }

        public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
        {
            return await _db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token);
        }

        public async Task DeleteRefreshTokenAsync(RefreshToken token)
        {
            _db.RefreshTokens.Remove(token);
        }
    }
}
