namespace Keka.Clone.Application.DTOs.Team;

public class TeamDto
{
    public Guid Id { get; set; }
    public string TeamName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int EmployeeCount { get; set; }
}
