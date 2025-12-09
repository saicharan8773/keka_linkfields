namespace Keka.Clone.Application.DTOs.Employee;

public class ManagerDto
{
    public Guid Id { get; set; } // This is the User.Id, needed for the FK
    public Guid EmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string DesignationTitle { get; set; } = string.Empty;
}
