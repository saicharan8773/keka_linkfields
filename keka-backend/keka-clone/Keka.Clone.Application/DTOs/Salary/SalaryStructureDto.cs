using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.DTOs.Salary;

public class SalaryStructureDto
{
    public Guid Id { get; set; }
    public decimal Basic { get; set; }
    public decimal HRA { get; set; }
    public decimal OtherAllowances { get; set; }
    public decimal Deductions { get; set; }
}