using AutoMapper;
using Keka.Clone.Application.DTOs.Job;
using Keka.Clone.Domain.Entities;
using System.Text.Json;

namespace Keka.Clone.Application.Mappings;

public class JobProfile : Profile
{
    public JobProfile()
    {
        // Entity → DTO
        CreateMap<Job, JobDto>()
            .ForMember(dest => dest.DepartmentName,
                opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : null))
            .ForMember(dest => dest.DesignationTitle,
                opt => opt.MapFrom(src => src.Designation != null ? src.Designation.Title : null))
            .ForMember(dest => dest.CreatedByName,
                opt => opt.MapFrom(src => src.CreatedByUser != null ? src.CreatedByUser.FullName : "Unknown"))
            .ForMember(dest => dest.UpdatedByName,
                opt => opt.MapFrom(src => src.UpdatedByUser != null ? src.UpdatedByUser.FullName : null))
            .ForMember(dest => dest.Skills,
                opt => opt.MapFrom(src => DeserializeSkills(src.Skills)));

        // CreateJobRequest → Job
        CreateMap<CreateJobRequest, Job>()
            .ForMember(dest => dest.Skills,
                opt => opt.MapFrom(src => SerializeSkills(src.Skills)))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedOn, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedOn, opt => opt.Ignore());

        // UpdateJobRequest → Job
        CreateMap<UpdateJobRequest, Job>()
            .ForMember(dest => dest.Skills,
                opt => opt.MapFrom(src => SerializeSkills(src.Skills)))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedOn, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedOn, opt => opt.Ignore());
    }

    private static string? SerializeSkills(List<string>? skills)
    {
        if (skills == null || skills.Count == 0)
            return null;

        return JsonSerializer.Serialize(skills);
    }

    private static List<string>? DeserializeSkills(string? skillsJson)
    {
        if (string.IsNullOrWhiteSpace(skillsJson))
            return null;

        try
        {
            return JsonSerializer.Deserialize<List<string>>(skillsJson);
        }
        catch
        {
            return null;
        }
    }
}
