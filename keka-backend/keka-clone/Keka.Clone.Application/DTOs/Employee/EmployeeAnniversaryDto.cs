namespace Keka.Clone.Application.DTOs.Employee;

public class EmployeeAnniversaryDto
{
    public Guid Id { get; set; }
    public string EmployeeCode { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? DisplayName { get; set; }
    public string WorkEmail { get; set; } = null!;
    public DateTime JoiningDate { get; set; }
    public int YearsCompleted { get; set; }
    public string AnniversaryMessage { get; set; } = null!;
    public string? DepartmentName { get; set; }
    public string? DesignationTitle { get; set; }
}
