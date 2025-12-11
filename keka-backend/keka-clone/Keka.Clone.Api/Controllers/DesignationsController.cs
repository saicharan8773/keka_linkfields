using Keka.Clone.Application.DTOs.Designation;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Keka.Clone.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class DesignationsController:ControllerBase
{
    private readonly IDesignationService _service;

    public DesignationsController(IDesignationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? departmentId)
    {
        if (!string.IsNullOrEmpty(departmentId))
        {
            try
            {
                if (Guid.TryParse(departmentId, out var id))
                {
                    return Ok(await _service.GetByDepartmentIdAsync(id));
                }
                else
                {
                    return Ok(await _service.GetByDepartmentNameAsync(departmentId));
                }
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            return Ok(await _service.GetByIdAsync(id));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDesignationRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }
    [HttpPatch("{id}")]
    public async Task<IActionResult> Editdesignation(Guid id ,  Designationupdate entity)
    {
        var designation = await _service.EditDesignationAsync(id, entity);
        return Ok(designation);
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _service.DeleteAsync(id);
            var message = "Designation deleted successfully";
            return Ok(message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}