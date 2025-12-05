using Keka.Clone.Application.DTOs.Designation;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Keka.Clone.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR,Manager")]
public class DesignationsController:ControllerBase
{
    private readonly IDesignationService _service;

    public DesignationsController(IDesignationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDesignationRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }
}