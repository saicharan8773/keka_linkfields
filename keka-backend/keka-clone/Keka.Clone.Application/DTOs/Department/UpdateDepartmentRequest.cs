using System;

namespace Keka.Clone.Application.DTOs.Department;

public class UpdateDepartmentRequest
{
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public string? Description { get; set; }
}
