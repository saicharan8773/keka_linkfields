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
            Code = request.Code,
            // Description = request.Description
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<DepartmentDto>(entity);
    }

    public async Task<DepartmentDto> UpdateAsync(Guid id, UpdateDepartmentRequest request)
    {
        var department = await _repo.GetByIdAsync(id);
        if (department == null)
            throw new Exception("Department not found.");

        // Check for duplicate code (excluding current department)
        var duplicateCode = await _repo.GetByCodeExcludingIdAsync(request.Code, id);
        if (duplicateCode != null)
            throw new Exception("Another department with this code already exists.");

        // Check for duplicate name (excluding current department)
        var duplicateName = await _repo.GetByNameExcludingIdAsync(request.Name, id);
        if (duplicateName != null)
            throw new Exception("Another department with this name already exists.");

        // Update department fields
        department.Name = request.Name;
        department.Code = request.Code;
        // department.Description = request.Description;

        _repo.Update(department);
        await _repo.SaveChangesAsync();

        return _mapper.Map<DepartmentDto>(department);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repo.DeleteWithCascadeAsync(id);
    }
}