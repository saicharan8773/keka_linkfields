using AutoMapper;
using Keka.Clone.Application.DTOs.Department;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Services;

public class DepartmentService:IDepartmentService
{
    private readonly IDepartmentRepository _repo;
    private readonly IMapper _mapper;

    public DepartmentService(IDepartmentRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<DepartmentDto>>(entities);
    }

    public async Task<DepartmentDto?> GetByIdAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        return entity == null ? null : _mapper.Map<DepartmentDto>(entity);
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request)
    {
        var existing = await _repo.GetByCodeAsync(request.Code);
        if (existing != null)
            throw new Exception("Department with this code already exists.");

        var entity = new Department
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Code = request.Code
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<DepartmentDto>(entity);
    }
}