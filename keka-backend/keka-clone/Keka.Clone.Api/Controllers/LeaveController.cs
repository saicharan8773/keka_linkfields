using System;
using Microsoft.AspNetCore.Mvc;
using Keka.Clone.Application.DTOs;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR,Manager,Employee")]

public class LeaveController:ControllerBase
{
    private readonly ILeaveService _service;

    public LeaveController(ILeaveService service)
    {
        _service = service;
    }

    [HttpGet("types/{empId:guid}")]
    public async Task<IActionResult> Types(Guid empId)
    {
        var data = await _service.GetLeaveTypesAsync(empId);
        return Ok(data);
    }

    [HttpPost("apply")]
    public async Task<IActionResult> ApplyLeave(LeaveRequestDto dto)
    {
        await _service.ApplyLeaveAsync(dto);
        return Ok("Leave applied successfully.");
    }

    [HttpPost("approve/{leaveId}")]
    public async Task<IActionResult> ApproveByCode(string leaveid)
    {
        await _service.ApproveLeaveByCodeAsync(leaveid);
        return Ok("Leave approved.");
    }

    [HttpPost("reject/{leaveId}")]
    public async Task<IActionResult> RejectByCode(string leaveid)
    {
        await _service.RejectLeaveByCodeAsync(leaveid);
        return Ok("Leave rejected.");
    }

    [HttpGet("history/{empId:guid}")]
    public async Task<IActionResult> History(Guid empId)
    {
        var data = await _service.GetLeaveHistoryAsync(empId);
        return Ok(data);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> PendingRequests()
    {
        var data = await _service.GetPendingRequestsAsync();
        return Ok(data);
    }


    [HttpGet("balance/{empId}/{leaveTypeId}")]
    public async Task<IActionResult> Balance(Guid empId, int leaveTypeId)
    {
        return Ok(await _service.GetRemainingLeavesAsync(empId, leaveTypeId));
    }
}
