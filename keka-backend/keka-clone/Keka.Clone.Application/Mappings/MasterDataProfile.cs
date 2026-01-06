// File: Keka.Clone.Application/Mappings/MasterDataProfile.cs
using AutoMapper;
using Keka.Clone.Application.DTOs.Department;
using Keka.Clone.Application.DTOs.Designation;
using Keka.Clone.Application.DTOs.Salary;
using Keka.Clone.Application.DTOs.Team;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Mappings;

public class MasterDataProfile:Profile
{
    public MasterDataProfile()
    {
        CreateMap<Department, DepartmentDto>()
            .ForMember(dest => dest.EmployeeCount, opt => opt.MapFrom(src => src.Employees.Count));
        CreateMap<Designation, DesignationDto>()
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department.Name))
            .ForMember(dest => dest.DepartmentCode, opt => opt.MapFrom(src => src.Department.Code));
        CreateMap<SalaryStructure, SalaryStructureDto>();
        CreateMap<Team, TeamDto>()
            .ForMember(dest => dest.EmployeeCount, opt => opt.MapFrom(src => src.Employees.Count));
    }
}