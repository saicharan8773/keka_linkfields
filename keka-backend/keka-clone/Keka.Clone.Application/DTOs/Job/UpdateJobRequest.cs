using System.ComponentModel.DataAnnotations;

namespace Keka.Clone.Application.DTOs.Job;

public class UpdateJobRequest
{
    [Required(ErrorMessage = "Job title is required")]
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = null!;

    [Required(ErrorMessage = "Job code is required")]
    [StringLength(50, ErrorMessage = "Job code cannot exceed 50 characters")]
    public string JobCode { get; set; } = null!;

    public Guid? DepartmentId { get; set; }

    public Guid? DesignationId { get; set; }

    [Required(ErrorMessage = "Employment type is required")]
    public string EmploymentType { get; set; } = "FullTime";

    [Required(ErrorMessage = "Experience level is required")]
    public string ExperienceLevel { get; set; } = "Fresher";

    [Required(ErrorMessage = "Location is required")]
    public string Location { get; set; } = "Onsite";

    [Range(0, double.MaxValue, ErrorMessage = "Minimum salary must be a positive number")]
    public decimal? SalaryMin { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Maximum salary must be a positive number")]
    public decimal? SalaryMax { get; set; }

    [Required(ErrorMessage = "Number of openings is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Openings must be at least 1")]
    public int Openings { get; set; } = 1;

    [Required(ErrorMessage = "Job description is required")]
    [StringLength(5000, ErrorMessage = "Description cannot exceed 5000 characters")]
    public string Description { get; set; } = null!;

    public List<string>? Skills { get; set; }

    [Required(ErrorMessage = "Job status is required")]
    public string Status { get; set; } = "Draft";
}
