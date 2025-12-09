using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.DTOs.Department;

public class CreateDepartmentRequest
{
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    // public string? Description { get; set; }
}