// File: Keka.Clone.Application/Mappings/MasterDataProfile.cs
using AutoMapper;
using Keka.Clone.Application.DTOs.Department;
using Keka.Clone.Application.DTOs.Designation;
using Keka.Clone.Application.DTOs.Salary;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Mappings;

public class MasterDataProfile:Profile
{
    public MasterDataProfile()
    {
        CreateMap<Department, DepartmentDto>();
        CreateMap<Designation, DesignationDto>();
        CreateMap<SalaryStructure, SalaryStructureDto>();
    }
}