namespace Keka.Clone.Domain.Entities;

public class Designation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = null!;
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
