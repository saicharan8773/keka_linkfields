using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
public class CreateDesignationRequest
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public Guid DepartmentId { get; set; }
}
