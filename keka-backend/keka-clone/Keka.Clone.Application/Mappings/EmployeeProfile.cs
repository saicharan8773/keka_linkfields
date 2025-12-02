using AutoMapper;
using Keka.Clone.Application.DTOs.Employee;
using Keka.Clone.Domain.Entities;
using System.Collections.Generic;
using System.Text.Json;

namespace Keka.Clone.Application.Mappings;

public class EmployeeProfile:Profile
{
    public EmployeeProfile()
    {
        // Entity → DTO
        CreateMap<Employee, EmployeeDto>()
            .ForMember(dest => dest.DepartmentName,
                opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : null))
            .ForMember(dest => dest.ManagerName,
                opt => opt.MapFrom(src => BuildFullName(src.Manager)))
            .ForMember(dest => dest.ManagerOfManagerName,
                opt => opt.MapFrom(src => src.Manager != null ? BuildFullName(src.Manager.Manager) : null))
            .ForMember(dest => dest.LocationName,
                opt => opt.MapFrom(src => BuildLocationName(src.Location)))
            .ForMember(dest => dest.ProjectName,
                opt => opt.MapFrom(src => ExtractProjectName(src.CustomFieldsJson)));

        // CreateEmployeeRequest → Employee
        CreateMap<CreateEmployeeRequest, Employee>()
            .ForMember(dest => dest.CustomFieldsJson,
                opt => opt.MapFrom(src => SerializeCustomFields(src.CustomFields)))
            .ForMember(dest => dest.EmployeeCode,
                opt => opt.MapFrom(src => (src.EmployeeCode ?? string.Empty).Trim()))
            .ForMember(dest => dest.WorkEmail,
                opt => opt.MapFrom(src => (src.WorkEmail ?? string.Empty).Trim()));

        // UpdateEmployeeRequest → Employee
        CreateMap<UpdateEmployeeRequest, Employee>()
            .ForMember(dest => dest.CustomFieldsJson,
                opt => opt.MapFrom(src => SerializeCustomFields(src.CustomFields)))
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

    private static string? SerializeCustomFields(object? customFields)
    {
        return customFields == null ? null : JsonSerializer.Serialize(customFields);
    }

    private static string? ExtractProjectName(string? customFieldsJson)
    {
        if (string.IsNullOrWhiteSpace(customFieldsJson))
            return null;

        try
        {
            using var doc = JsonDocument.Parse(customFieldsJson);
            var root = doc.RootElement;

            // Try different possible property names for project
            if (root.TryGetProperty("projectName", out var projectNameElement))
                return projectNameElement.GetString();
            
            if (root.TryGetProperty("project_name", out var projectNameElement2))
                return projectNameElement2.GetString();
            
            if (root.TryGetProperty("ProjectName", out var projectNameElement3))
                return projectNameElement3.GetString();
            
            if (root.TryGetProperty("project", out var projectElement))
            {
                if (projectElement.ValueKind == JsonValueKind.String)
                    return projectElement.GetString();
                
                if (projectElement.ValueKind == JsonValueKind.Object && projectElement.TryGetProperty("name", out var nameElement))
                    return nameElement.GetString();
            }

            return null;
        }
        catch
        {
            return null;
        }
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
