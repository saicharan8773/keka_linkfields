namespace Keka.Clone.Domain.Entities;

public class SalaryStructure
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public decimal Basic { get; set; }
    public decimal HRA { get; set; }
    public decimal OtherAllowances { get; set; }
    public decimal Deductions { get; set; }
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
