namespace Keka.Clone.Application.DTOs.Employee;

public class EmployeeSearchParams
{
    public string? Query { get; set; } // search across name, email, code
    public Guid? DepartmentId { get; set; }
    public Guid? DesignationId { get; set; }
    public Guid? ManagerId { get; set; }
    public Guid? LocationId { get; set; }
    public string? EmploymentType { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDesc { get; set; }
}
