using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.DTOs.Designation;

public class DesignationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
}