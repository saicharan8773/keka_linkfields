using System.ComponentModel.DataAnnotations;

namespace Keka.Clone.Application.DTOs.Team;

public class AssignEmployeeToTeamRequest
{
    [Required(ErrorMessage = "Employee ID is required")]
    public Guid EmployeeId { get; set; }
    
    [Required(ErrorMessage = "Team ID is required")]
    public Guid TeamId { get; set; }
}
