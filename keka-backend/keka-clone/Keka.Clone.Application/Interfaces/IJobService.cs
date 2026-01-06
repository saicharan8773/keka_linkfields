using Keka.Clone.Application.DTOs.Job;

namespace Keka.Clone.Application.Interfaces;

public interface IJobService
{
    Task<JobDto> CreateAsync(CreateJobRequest request, Guid userId);
    Task<JobDto> UpdateAsync(Guid id, UpdateJobRequest request, Guid userId);
    Task<JobDto?> GetByIdAsync(Guid id);
    Task<(IEnumerable<JobDto> Items, int Total)> SearchAsync(JobSearchParams searchParams);
    Task CloseJobAsync(Guid id, Guid userId);
    Task DeleteAsync(Guid id);
}
