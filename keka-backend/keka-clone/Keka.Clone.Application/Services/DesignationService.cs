using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Keka.Clone.Application.DTOs.Designation;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Services;

public class DesignationService : IDesignationService
{
    private readonly IDesignationRepository _repo;
    private readonly IDepartmentRepository _deptRepo;
    private readonly IMapper _mapper;

    public DesignationService(IDesignationRepository repo, IDepartmentRepository deptRepo, IMapper mapper)
    {
        _repo = repo;
        _deptRepo = deptRepo;
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

    public async Task<IEnumerable<DesignationDto>> GetByDepartmentNameAsync(string name)
    {
        var department = await _deptRepo.GetByNameAsync(name);
        if (department == null)
            throw new KeyNotFoundException($"Department with name '{name}' not found.");

        var entities = await _repo.GetByDepartmentIdAsync(department.Id);
        return _mapper.Map<IEnumerable<DesignationDto>>(entities);
    }
}