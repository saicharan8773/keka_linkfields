namespace Keka.Clone.Domain.Entities;

public class Location
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string City { get; set; } = null!;
    public string Country { get; set; } = null!;
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
