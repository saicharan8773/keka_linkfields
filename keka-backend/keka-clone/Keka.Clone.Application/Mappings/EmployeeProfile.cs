using AutoMapper;
using Keka.Clone.Application.DTOs.Employee;
using Keka.Clone.Domain.Entities;
using System.Collections.Generic;

namespace Keka.Clone.Application.Mappings;

public class EmployeeProfile : Profile
{
    public EmployeeProfile()
    {
        // Entity → DTO
        CreateMap<Employee, EmployeeDto>()
            .ForMember(dest => dest.DepartmentName,
                opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : null))
            .ForMember(dest => dest.DesignationTitle,
                opt => opt.MapFrom(src => src.Designation != null ? src.Designation.Title : null))
            .ForMember(dest => dest.ManagerName,
                opt => opt.MapFrom(src => src.Manager != null ? src.Manager.FullName : null))
            .ForMember(dest => dest.LocationName,
                opt => opt.MapFrom(src => BuildLocationName(src.Location)));

        // CreateEmployeeRequest → Employee
        CreateMap<CreateEmployeeRequest, Employee>()
            .ForMember(dest => dest.EmployeeCode,
                opt => opt.MapFrom(src => (src.EmployeeCode ?? string.Empty).Trim()))
            .ForMember(dest => dest.WorkEmail,
                opt => opt.MapFrom(src => (src.WorkEmail ?? string.Empty).Trim()));

        // UpdateEmployeeRequest → Employee
        CreateMap<UpdateEmployeeRequest, Employee>()
            .ForMember(dest => dest.EmployeeCode,
                opt => opt.Condition(src => src.EmployeeCode != null)) // update only if sent
            .ForMember(dest => dest.EmployeeCode,
                opt => opt.MapFrom(src => (src.EmployeeCode ?? string.Empty).Trim()))
            .ForMember(dest => dest.WorkEmail,
                opt => opt.Condition(src => src.WorkEmail != null))
            .ForMember(dest => dest.WorkEmail,
                opt => opt.MapFrom(src => (src.WorkEmail ?? string.Empty).Trim()))
            .ForAllMembers(opt =>
                opt.Condition((src, dest, srcMember) => srcMember != null));
    }

    private static string? BuildFullName(Employee? employee)
    {
        if (employee == null) return null;

        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(employee.FirstName))
            parts.Add(employee.FirstName);
        if (!string.IsNullOrWhiteSpace(employee.LastName))
            parts.Add(employee.LastName);

        return parts.Count == 0 ? null : string.Join(" ", parts);
    }

    private static string? BuildLocationName(Location? location)
    {
        if (location == null) return null;

        if (!string.IsNullOrWhiteSpace(location.City) && !string.IsNullOrWhiteSpace(location.Country))
            return $"{location.City}, {location.Country}";

        return location.City ?? location.Country;
    }
}
