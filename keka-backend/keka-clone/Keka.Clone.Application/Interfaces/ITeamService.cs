using Keka.Clone.Application.DTOs.Team;

namespace Keka.Clone.Application.Interfaces;

public interface ITeamService
{
    Task<IEnumerable<TeamDto>> GetAllAsync();
    Task<TeamDto?> GetByIdAsync(Guid id);
    Task<TeamDto> CreateAsync(CreateTeamRequest request);
    Task<TeamDto> UpdateAsync(Guid id, UpdateTeamRequest request);
    Task<bool> DeleteAsync(Guid id);
}
