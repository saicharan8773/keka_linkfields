using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories;

public class TeamRepository : ITeamRepository
{
    private readonly AppDbContext _db;
    
    public TeamRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Team>> GetAllAsync()
    {
        return await _db.Teams
            .Include(t => t.Employees)
            .OrderBy(t => t.TeamName)
            .ToListAsync();
    }

    public async Task<Team?> GetByIdAsync(Guid id)
    {
        return await _db.Teams
            .Include(t => t.Employees)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Team?> GetByNameAsync(string teamName)
    {
        return await _db.Teams
            .FirstOrDefaultAsync(t => t.TeamName == teamName);
    }

    public async Task<Team?> GetByNameExcludingIdAsync(string teamName, Guid excludeId)
    {
        return await _db.Teams
            .FirstOrDefaultAsync(t => t.TeamName == teamName && t.Id != excludeId);
    }

    public async Task AddAsync(Team team)
    {
        await _db.Teams.AddAsync(team);
    }

    public void Update(Team team)
    {
        team.UpdatedAt = DateTime.UtcNow;
        _db.Teams.Update(team);
    }

    public void Delete(Team team)
    {
        _db.Teams.Remove(team);
    }

    public async Task<bool> DeleteWithCascadeAsync(Guid id)
    {
        var team = await _db.Teams.FindAsync(id);
        if (team == null)
            return false;

        // Use transaction to ensure all operations succeed or fail together
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            // Set all employees' TeamId to NULL
            await _db.Employees
                .Where(e => e.TeamId == id)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.TeamId, (Guid?)null));

            // Delete the team itself
            _db.Teams.Remove(team);
            await _db.SaveChangesAsync();

            // Commit transaction
            await transaction.CommitAsync();
            return true;
        }
        catch (Exception)
        {
            // Rollback on any error
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}
