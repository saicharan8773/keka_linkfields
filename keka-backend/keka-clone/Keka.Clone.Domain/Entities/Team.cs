namespace Keka.Clone.Domain.Entities;

public class Team
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TeamName { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property: One Team has many Employees
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
