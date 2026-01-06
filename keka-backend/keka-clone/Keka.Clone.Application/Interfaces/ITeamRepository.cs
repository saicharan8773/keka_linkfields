using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface ITeamRepository
{
    Task<IEnumerable<Team>> GetAllAsync();
    Task<Team?> GetByIdAsync(Guid id);
    Task<Team?> GetByNameAsync(string teamName);
    Task<Team?> GetByNameExcludingIdAsync(string teamName, Guid excludeId);
    Task AddAsync(Team team);
    void Update(Team team);
    void Delete(Team team);
    Task<bool> DeleteWithCascadeAsync(Guid id);
    Task SaveChangesAsync();
}
