
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface ILocationRepository
{
    Task<List<Location>> GetAllAsync();
    Task<Location?> GetByIdAsync(Guid id);
    Task<Location> AddAsync(Location location);
    Task<bool> ExistsAsync(string city, string country);
}
