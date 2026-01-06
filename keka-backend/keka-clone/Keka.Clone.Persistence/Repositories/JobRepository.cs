using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories;

public class JobRepository : IJobRepository
{
    private readonly AppDbContext _db;

    public JobRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Job?> GetByIdAsync(Guid id)
    {
        return await _db.Jobs
            .Include(j => j.Department)
            .Include(j => j.Designation)
            .Include(j => j.CreatedByUser)
            .Include(j => j.UpdatedByUser)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<IEnumerable<Job>> GetAllAsync()
    {
        return await _db.Jobs
            .Include(j => j.Department)
            .Include(j => j.Designation)
            .Include(j => j.CreatedByUser)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Job> Items, int Total)> SearchAsync(
        string? query,
        Guid? departmentId,
        Guid? designationId,
        string? status,
        string? employmentType,
        string? location,
        string? experienceLevel,
        int page,
        int pageSize,
        string? sortBy,
        bool sortDesc)
    {
        var q = _db.Jobs.AsQueryable();

        // Search in title and description
        if (!string.IsNullOrWhiteSpace(query))
        {
            var like = $"%{query.ToLower()}%";
            q = q.Where(j =>
                EF.Functions.Like((j.Title ?? "").ToLower(), like) ||
                EF.Functions.Like((j.Description ?? "").ToLower(), like) ||
                EF.Functions.Like((j.JobCode ?? "").ToLower(), like)
            );
        }

        // Filters
        if (departmentId.HasValue)
            q = q.Where(j => j.DepartmentId == departmentId);

        if (designationId.HasValue)
            q = q.Where(j => j.DesignationId == designationId);

        if (!string.IsNullOrWhiteSpace(status))
            q = q.Where(j => j.Status.ToLower() == status.ToLower());

        if (!string.IsNullOrWhiteSpace(employmentType))
            q = q.Where(j => j.EmploymentType.ToLower() == employmentType.ToLower());

        if (!string.IsNullOrWhiteSpace(location))
            q = q.Where(j => j.Location.ToLower() == location.ToLower());

        if (!string.IsNullOrWhiteSpace(experienceLevel))
            q = q.Where(j => j.ExperienceLevel.ToLower() == experienceLevel.ToLower());

        var total = await q.CountAsync();

        // Sorting
        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            sortBy = sortBy.ToLower();
            q = sortBy switch
            {
                "title" => sortDesc ? q.OrderByDescending(j => j.Title) : q.OrderBy(j => j.Title),
                "status" => sortDesc ? q.OrderByDescending(j => j.Status) : q.OrderBy(j => j.Status),
                "createdon" => sortDesc ? q.OrderByDescending(j => j.CreatedOn) : q.OrderBy(j => j.CreatedOn),
                _ => sortDesc ? q.OrderByDescending(j => j.CreatedOn) : q.OrderBy(j => j.CreatedOn)
            };
        }
        else
        {
            q = sortDesc ? q.OrderByDescending(j => j.CreatedOn) : q.OrderBy(j => j.CreatedOn);
        }

        // Include related entities
        var withIncludes = q
            .Include(j => j.Department)
            .Include(j => j.Designation)
            .Include(j => j.CreatedByUser)
            .Include(j => j.UpdatedByUser);

        // Pagination
        List<Job> items;
        if (!string.IsNullOrWhiteSpace(query) || pageSize == -1)
        {
            items = await withIncludes.ToListAsync();
        }
        else
        {
            items = await withIncludes
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        return (items, total);
    }

    public async Task<Job?> GetByJobCodeAsync(string jobCode)
    {
        return await _db.Jobs
            .FirstOrDefaultAsync(j => j.JobCode == jobCode);
    }

    public async Task<string> GetNextJobCodeAsync(int year)
    {
        // Get the highest sequence number for the given year
        var prefix = $"JOB-{year}-";
        var existingCodes = await _db.Jobs
            .Where(j => j.JobCode.StartsWith(prefix))
            .Select(j => j.JobCode)
            .ToListAsync();

        int maxSequence = 0;
        foreach (var code in existingCodes)
        {
            var parts = code.Split('-');
            if (parts.Length == 3 && int.TryParse(parts[2], out int seq))
            {
                if (seq > maxSequence)
                    maxSequence = seq;
            }
        }

        var nextSequence = maxSequence + 1;
        return $"{prefix}{nextSequence:D3}"; // Format as 001, 002, etc.
    }

    public async Task AddAsync(Job job)
    {
        await _db.Jobs.AddAsync(job);
    }

    public async Task UpdateAsync(Job job)
    {
        _db.Jobs.Update(job);
    }

    public async Task DeleteAsync(Job job)
    {
        _db.Jobs.Remove(job);
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}
