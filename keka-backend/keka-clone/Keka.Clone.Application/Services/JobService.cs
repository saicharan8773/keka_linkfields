using AutoMapper;
using Keka.Clone.Application.DTOs.Job;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Services;

public class JobService : IJobService
{
    private readonly IJobRepository _repo;
    private readonly IMapper _mapper;

    public JobService(IJobRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<JobDto> CreateAsync(CreateJobRequest request, Guid userId)
    {
        // Validate salary range
        if (request.SalaryMin.HasValue && request.SalaryMax.HasValue)
        {
            if (request.SalaryMin > request.SalaryMax)
            {
                throw new ArgumentException("Minimum salary cannot be greater than maximum salary.");
            }
        }

        // Generate job code if not provided
        if (string.IsNullOrWhiteSpace(request.JobCode))
        {
            var year = DateTime.UtcNow.Year;
            request.JobCode = await _repo.GetNextJobCodeAsync(year);
        }
        else
        {
            // Check if job code already exists
            var existing = await _repo.GetByJobCodeAsync(request.JobCode);
            if (existing != null)
            {
                throw new ArgumentException($"Job code '{request.JobCode}' already exists.");
            }
        }

        var job = _mapper.Map<Job>(request);
        job.Id = Guid.NewGuid();
        job.CreatedBy = userId;
        job.CreatedOn = DateTime.UtcNow;

        await _repo.AddAsync(job);
        await _repo.SaveChangesAsync();

        // Reload with navigation properties
        var created = await _repo.GetByIdAsync(job.Id);
        return _mapper.Map<JobDto>(created);
    }

    public async Task<JobDto> UpdateAsync(Guid id, UpdateJobRequest request, Guid userId)
    {
        var job = await _repo.GetByIdAsync(id);
        if (job == null)
        {
            throw new KeyNotFoundException("Job not found.");
        }

        // Validate salary range
        if (request.SalaryMin.HasValue && request.SalaryMax.HasValue)
        {
            if (request.SalaryMin > request.SalaryMax)
            {
                throw new ArgumentException("Minimum salary cannot be greater than maximum salary.");
            }
        }

        // Check if job code is being changed and if it already exists
        if (request.JobCode != job.JobCode)
        {
            var existing = await _repo.GetByJobCodeAsync(request.JobCode);
            if (existing != null)
            {
                throw new ArgumentException($"Job code '{request.JobCode}' already exists.");
            }
        }

        _mapper.Map(request, job);
        job.UpdatedBy = userId;
        job.UpdatedOn = DateTime.UtcNow;

        await _repo.UpdateAsync(job);
        await _repo.SaveChangesAsync();

        // Reload with navigation properties
        var updated = await _repo.GetByIdAsync(job.Id);
        return _mapper.Map<JobDto>(updated);
    }

    public async Task<JobDto?> GetByIdAsync(Guid id)
    {
        var job = await _repo.GetByIdAsync(id);
        return job == null ? null : _mapper.Map<JobDto>(job);
    }

    public async Task<(IEnumerable<JobDto> Items, int Total)> SearchAsync(JobSearchParams searchParams)
    {
        var (items, total) = await _repo.SearchAsync(
            searchParams.Query,
            searchParams.DepartmentId,
            searchParams.DesignationId,
            searchParams.Status,
            searchParams.EmploymentType,
            searchParams.Location,
            searchParams.ExperienceLevel,
            searchParams.Page,
            searchParams.PageSize,
            searchParams.SortBy,
            searchParams.SortDesc
        );

        return (_mapper.Map<IEnumerable<JobDto>>(items), total);
    }

    public async Task CloseJobAsync(Guid id, Guid userId)
    {
        var job = await _repo.GetByIdAsync(id);
        if (job == null)
        {
            throw new KeyNotFoundException("Job not found.");
        }

        job.Status = "Closed";
        job.UpdatedBy = userId;
        job.UpdatedOn = DateTime.UtcNow;

        await _repo.UpdateAsync(job);
        await _repo.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var job = await _repo.GetByIdAsync(id);
        if (job == null)
        {
            throw new KeyNotFoundException("Job not found.");
        }

        await _repo.DeleteAsync(job);
        await _repo.SaveChangesAsync();
    }
}
