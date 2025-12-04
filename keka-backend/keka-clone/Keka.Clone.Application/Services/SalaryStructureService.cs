using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Keka.Clone.Application.DTOs.Salary;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Services;

public class SalaryStructureService:ISalaryStructureService
{
    private readonly ISalaryStructureRepository _repo;
    private readonly IMapper _mapper;

    public SalaryStructureService(ISalaryStructureRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SalaryStructureDto>> GetAllAsync()
    {
        var entities = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<SalaryStructureDto>>(entities);
    }

    public async Task<SalaryStructureDto> CreateAsync(CreateSalaryStructureRequest request)
    {
        var entity = new SalaryStructure
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Basic = request.Basic,
            HRA = request.HRA,
            OtherAllowances = request.OtherAllowances,
            Deductions = request.Deductions
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<SalaryStructureDto>(entity);
    }
}