namespace Keka.Clone.Application.DTOs.Job;

public class JobDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string JobCode { get; set; } = null!;
    public Guid? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public Guid? DesignationId { get; set; }
    public string? DesignationTitle { get; set; }
    public string EmploymentType { get; set; } = null!;
    public string ExperienceLevel { get; set; } = null!;
    public string Location { get; set; } = null!;
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public int Openings { get; set; }
    public string Description { get; set; } = null!;
    public List<string>? Skills { get; set; }
    public string Status { get; set; } = null!;
    public Guid CreatedBy { get; set; }
    public string CreatedByName { get; set; } = null!;
    public DateTime CreatedOn { get; set; }
    public Guid? UpdatedBy { get; set; }
    public string? UpdatedByName { get; set; }
    public DateTime? UpdatedOn { get; set; }
}
