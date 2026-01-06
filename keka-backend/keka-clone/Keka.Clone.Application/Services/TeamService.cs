using AutoMapper;
using Keka.Clone.Application.DTOs.Team;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Services;

public class TeamService : ITeamService
{
    private readonly ITeamRepository _repo;
    private readonly IMapper _mapper;

    public TeamService(ITeamRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<TeamDto>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<TeamDto>>(entities);
    }

    public async Task<TeamDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return entity == null ? null : _mapper.Map<TeamDto>(entity);
    }

    public async Task<TeamDto> CreateAsync(CreateTeamRequest request)
    {
        // Check for duplicate team name
        var existing = await _repo.GetByNameAsync(request.TeamName);
        if (existing != null)
            throw new Exception("Team with this name already exists.");

        var entity = new Team
        {
            Id = Guid.NewGuid(),
            TeamName = request.TeamName,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<TeamDto>(entity);
    }

    public async Task<TeamDto> UpdateAsync(Guid id, UpdateTeamRequest request)
    {
        var team = await _repo.GetByIdAsync(id);
        if (team == null)
            throw new Exception("Team not found.");

        // Check for duplicate name (excluding current team)
        var duplicateName = await _repo.GetByNameExcludingIdAsync(request.TeamName, id);
        if (duplicateName != null)
            throw new Exception("Another team with this name already exists.");

        // Update team fields
        team.TeamName = request.TeamName;
        team.UpdatedAt = DateTime.UtcNow;

        _repo.Update(team);
        await _repo.SaveChangesAsync();

        return _mapper.Map<TeamDto>(team);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repo.DeleteWithCascadeAsync(id);
    }
}
