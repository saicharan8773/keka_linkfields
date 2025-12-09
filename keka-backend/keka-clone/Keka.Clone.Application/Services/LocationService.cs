
using Keka.Clone.Application.DTOs.Location;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Services;

public class LocationService : ILocationService
{
    private readonly ILocationRepository _repository;

    public LocationService(ILocationRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<LocationDto>> GetAllAsync()
    {
        var locations = await _repository.GetAllAsync();
        return locations.Select(l => new LocationDto
        {
            Id = l.Id,
            City = l.City,
            Country = l.Country
        }).ToList();
    }

    public async Task<LocationDto?> GetByIdAsync(Guid id)
    {
        var location = await _repository.GetByIdAsync(id);
        if (location == null) return null;

        return new LocationDto
        {
            Id = location.Id,
            City = location.City,
            Country = location.Country
        };
    }

    public async Task<LocationDto> CreateAsync(CreateLocationDto request)
    {
        // Check if location already exists
        if (await _repository.ExistsAsync(request.City, request.Country))
        {
            throw new InvalidOperationException($"Location with City '{request.City}' and Country '{request.Country}' already exists.");
        }

        var location = new Location
        {
            City = request.City,
            Country = request.Country
        };

        var created = await _repository.AddAsync(location);

        return new LocationDto
        {
            Id = created.Id,
            City = created.City,
            Country = created.Country
        };
    }
}
