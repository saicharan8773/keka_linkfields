namespace Keka.Clone.Domain.Entities;

public class Department
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
