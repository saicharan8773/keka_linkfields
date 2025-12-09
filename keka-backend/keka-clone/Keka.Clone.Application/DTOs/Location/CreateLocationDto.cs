
using System.ComponentModel.DataAnnotations;

namespace Keka.Clone.Application.DTOs.Location;

public class CreateLocationDto
{
    [Required]
    public string City { get; set; } = null!;
    
    [Required]
    public string Country { get; set; } = null!;
}
