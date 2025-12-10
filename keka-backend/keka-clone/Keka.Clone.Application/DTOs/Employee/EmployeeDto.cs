namespace Keka.Clone.Application.DTOs.Employee;

public class EmployeeDto
{
    public Guid Id { get; set; }
    public string EmployeeCode { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string? DisplayName { get; set; }
    public string WorkEmail { get; set; } = null!;
    public string? MobileNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Nationality { get; set; }
    public DateTime JoiningDate { get; set; }
    public string Role { get; set; }
    public Guid? DesignationId { get; set; }
    public string? DesignationTitle { get; set; }
    public Guid? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public Guid? ManagerId { get; set; }
    public string? ManagerName { get; set; }
    public Guid? LocationId { get; set; }
    public string? LocationName { get; set; }
    public string EmploymentType { get; set; } = null!;
    public string? TimeType { get; set; }
}
