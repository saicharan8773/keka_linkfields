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
    private readonly IMapper _mapper;

    public DesignationService(IDesignationRepository repo, IMapper mapper)
    {
        _repo = repo;
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
}