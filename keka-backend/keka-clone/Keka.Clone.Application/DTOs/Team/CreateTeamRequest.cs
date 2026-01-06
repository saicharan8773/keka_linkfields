using System.ComponentModel.DataAnnotations;

namespace Keka.Clone.Application.DTOs.Team;

public class CreateTeamRequest
{
    [Required(ErrorMessage = "Team name is required")]
    [StringLength(100, ErrorMessage = "Team name cannot exceed 100 characters")]
    public string TeamName { get; set; } = null!;
}
