using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface IJobRepository
{
    Task<Job?> GetByIdAsync(Guid id);
    Task<IEnumerable<Job>> GetAllAsync();
    Task<(IEnumerable<Job> Items, int Total)> SearchAsync(
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
        bool sortDesc);
    Task<Job?> GetByJobCodeAsync(string jobCode);
    Task<string> GetNextJobCodeAsync(int year);
    Task AddAsync(Job job);
    Task UpdateAsync(Job job);
    Task DeleteAsync(Job job);
    Task SaveChangesAsync();
}
