using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using AutoMapper;
using Keka.Clone.Application.DTOs.Designation;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Services;

public class DesignationService : IDesignationService
{
    private readonly IDesignationRepository _repo;
    private readonly IDepartmentRepository _deptRepo;
    private readonly IEmployeeRepository _employeeRepo;
    private readonly IMapper _mapper;

    public DesignationService(IDesignationRepository repo, IDepartmentRepository deptRepo, IEmployeeRepository employeeRepo, IMapper mapper)
    {
        _repo = repo;
        _deptRepo = deptRepo;
        _employeeRepo = employeeRepo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DesignationDto>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<DesignationDto>>(entities);
    }

    public async Task<DesignationDto> CreateAsync(CreateDesignationRequest request)
    {
        var entity = new Designation
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            DepartmentId = request.DepartmentId
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<DesignationDto>(entity);
    }

    public async Task<IEnumerable<DesignationDto>> GetByDepartmentIdAsync(Guid departmentId)
    {
        var department = await _deptRepo.GetByIdAsync(departmentId);
        if (department == null)
            throw new KeyNotFoundException($"Department with ID {departmentId} not found.");

        var entities = await _repo.GetByDepartmentIdAsync(departmentId);
        return _mapper.Map<IEnumerable<DesignationDto>>(entities);
    }

    public async Task<DesignationDto> GetByIdAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null)
            throw new KeyNotFoundException($"Designation with ID {id} not found.");

        return _mapper.Map<DesignationDto>(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null)
            throw new KeyNotFoundException($"Designation with ID {id} not found.");

        var employees = await _employeeRepo.GetByDesignationIdAsync(id);
        foreach (var employee in employees)
        {
            employee.DesignationId = null;
        }
        await _employeeRepo.SaveChangesAsync();
        _repo.Delete(entity);
        await _repo.SaveChangesAsync();
    }

    public async Task<IEnumerable<DesignationDto>> GetByDepartmentNameAsync(string name)
    {
        var department = await _deptRepo.GetByNameAsync(name);
        if (department == null)
            throw new KeyNotFoundException($"Department with name '{name}' not found.");

        var entities = await _repo.GetByDepartmentIdAsync(department.Id);
        return _mapper.Map<IEnumerable<DesignationDto>>(entities);
    }

    public async Task<DesignationDto> EditDesignationAsync(Guid id , Designationupdate entity)
    {
        var designationEntity = await _repo.GetByIdAsync(id);

        if (designationEntity == null)
        {
            throw new KeyNotFoundException($"Designation with ID {id} not found.");
        }

        designationEntity.Title = entity.Title;
        designationEntity.Description = entity.Description;
        designationEntity.DepartmentId = entity.DepartmentId;

        await _repo.SaveChangesAsync();
        var result =  _mapper.Map<DesignationDto>(designationEntity);

        return result;
    }
}