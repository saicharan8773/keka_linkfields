using Keka.Clone.Application.DTOs.Employee;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Keka.Clone.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController:ControllerBase
{
    private readonly IEmployeeService _service;

    public EmployeesController(IEmployeeService service)
    {
        _service = service;
    }

    // GET api/employees
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] EmployeeSearchParams searchParams)
    {
        var (items, total) = await _service.SearchAsync(searchParams);
        return Ok(new { Items = items, Total = total, Page = searchParams.Page, PageSize = searchParams.PageSize });
    }

    // GET api/employees/{id}
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,HR,Manager,Employee")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var dto = await _service.GetByIdAsync(id);
        if (dto == null) return NotFound();
        return Ok(dto);
    }

    // POST api/employees
    [HttpPost]
    [AllowAnonymous]
    // [Authorize(Roles = "Admin,HR","Manager")]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, new { message = "Employee created successfully" });
    }

    // PUT api/employees/{id}
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEmployeeRequest request)
    {
        var updated = await _service.UpdateAsync(id, request);
        return Ok(updated);
    }

    // DELETE api/employees/{id}
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("Managers")]
    [AllowAnonymous] 
    // [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<IActionResult> GetManagers()
    {
        var managers = await _service.GetManagersAsync();
        return Ok(managers);
    }
}
 