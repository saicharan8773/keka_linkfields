namespace Keka.Clone.Domain.Entities;

public class Job
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = null!;
    public string JobCode { get; set; } = null!;
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public Guid? DesignationId { get; set; }
    public Designation? Designation { get; set; }
    public string EmploymentType { get; set; } = "FullTime"; // FullTime, PartTime, Contract, Internship
    public string ExperienceLevel { get; set; } = "Fresher"; // Fresher, 1-3, 3-5, 5+
    public string Location { get; set; } = "Onsite"; // Onsite, Hybrid, Remote
    public decimal? SalaryMin { get; set; }
    public decimal? SalaryMax { get; set; }
    public int Openings { get; set; } = 1;
    public string Description { get; set; } = null!;
    public string? Skills { get; set; } // Stored as JSON array
    public string Status { get; set; } = "Draft"; // Draft, Active, Closed
    public Guid CreatedBy { get; set; }
    public User CreatedByUser { get; set; } = null!;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public Guid? UpdatedBy { get; set; }
    public User? UpdatedByUser { get; set; }
    public DateTime? UpdatedOn { get; set; }
}
