namespace Keka.Clone.Application.DTOs.Job;

public class JobSearchParams
{
    public string? Query { get; set; } // Search in title and description
    public Guid? DepartmentId { get; set; }
    public Guid? DesignationId { get; set; }
    public string? Status { get; set; } // Draft, Active, Closed
    public string? EmploymentType { get; set; } // FullTime, PartTime, Contract, Internship
    public string? Location { get; set; } // Onsite, Hybrid, Remote
    public string? ExperienceLevel { get; set; } // Fresher, 1-3, 3-5, 5+
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } // CreatedOn, Title, Status
    public bool SortDesc { get; set; } = true;
}
