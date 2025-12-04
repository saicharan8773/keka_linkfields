using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
public class CreateSalaryStructureRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Basic { get; set; }
    public decimal HRA { get; set; }
    public decimal OtherAllowances { get; set; }
    public decimal Deductions { get; set; }
}
