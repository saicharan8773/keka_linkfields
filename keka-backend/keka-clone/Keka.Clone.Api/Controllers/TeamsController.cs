using Keka.Clone.Application.DTOs.Team;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Keka.Clone.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR,Manager")]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;
    private readonly IEmployeeService _employeeService;

    public TeamsController(ITeamService teamService, IEmployeeService employeeService)
    {
        _teamService = teamService;
        _employeeService = employeeService;
    }

    /// <summary>
    /// Get all teams
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _teamService.GetAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Get team by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _teamService.GetByIdAsync(id);
        if (result == null) 
            return NotFound(new { message = "Team not found." });
        
        return Ok(result);
    }

    /// <summary>
    /// Get all employees in a team
    /// </summary>
    [HttpGet("{id:guid}/employees")]
    public async Task<IActionResult> GetEmployeesByTeamId(Guid id)
    {
        var employees = await _employeeService.GetByTeamIdAsync(id);
        return Ok(employees);
    }

    /// <summary>
    /// Create a new team
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeamRequest request)
    {
        try
        {
            var created = await _teamService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing team
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTeamRequest request)
    {
        try
        {
            var updated = await _teamService.UpdateAsync(id, request);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("not found"))
                return NotFound(new { message = ex.Message });
            
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Delete a team
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var result = await _teamService.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Team not found." });

            return Ok(new 
            { 
                message = "Team deleted successfully. Employees updated with NULL TeamId." 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Error deleting team: {ex.Message}" });
        }
    }

    /// <summary>
    /// Assign an employee to a team
    /// </summary>
    [HttpPost("assign-employee")]
    public async Task<IActionResult> AssignEmployeeToTeam([FromBody] AssignEmployeeToTeamRequest request)
    {
        try
        {
            var result = await _employeeService.AssignToTeamAsync(request.EmployeeId, request.TeamId);
            return Ok(new { message = "Employee assigned to team successfully.", employee = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
