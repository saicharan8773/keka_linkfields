
using Keka.Clone.Application.DTOs.Location;

namespace Keka.Clone.Application.Interfaces;

public interface ILocationService
{
    Task<List<LocationDto>> GetAllAsync();
    Task<LocationDto?> GetByIdAsync(Guid id);
    Task<LocationDto> CreateAsync(CreateLocationDto request);
}
