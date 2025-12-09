// File: Keka.Clone.Api/Controllers/DepartmentsController.cs
using Keka.Clone.Application.DTOs.Department;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Keka.Clone.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR,Manager")]
public class DepartmentsController:ControllerBase
{
    private readonly IDepartmentService _service;
    private readonly IEmployeeService _employeeService;

    public DepartmentsController(IDepartmentService service, IEmployeeService employeeService)
    {
        _service = service;
        _employeeService = employeeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("{id}/employees")]
    public async Task<IActionResult> GetEmployees(Guid id)
    {
        var employees = await _employeeService.GetByDepartmentIdAsync(id);
        return Ok(employees);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDepartmentRequest request)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, request);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("not found"))
                return NotFound(new { message = ex.Message });
            
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Department not found." });

            return Ok(new 
            { 
                message = "Department deleted successfully. Related designations removed, and employees updated with NULL DepartmentId." 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Error deleting department: {ex.Message}" });
        }
    }
}