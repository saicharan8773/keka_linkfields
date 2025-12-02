using System;
using Microsoft.AspNetCore.Mvc;
using Keka.Clone.Application.DTOs;
using Keka.Clone.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
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

    // Approve / Reject using integer request Id (internal DB key)

    [HttpPost("approve/{id}")]
    public async Task<IActionResult> Approve(int id)
    {
        await _service.ApproveLeaveAsync(id);
        return Ok("Leave approved.");
    }

    [HttpPost("reject/{id}")]
    public async Task<IActionResult> Reject(int id)
    {
        await _service.RejectLeaveAsync(id);
        return Ok("Leave rejected.");
    }

    // Approve / Reject using public RequestCode, e.g. "LR-20251201071511-005bd7-LT1-fd75"

    [HttpPost("approve/by-code/{code}")]
    public async Task<IActionResult> ApproveByCode(string code)
    {
        await _service.ApproveLeaveByCodeAsync(code);
        return Ok("Leave approved.");
    }

    [HttpPost("reject/by-code/{code}")]
    public async Task<IActionResult> RejectByCode(string code)
    {
        await _service.RejectLeaveByCodeAsync(code);
        return Ok("Leave rejected.");
    }

    [HttpGet("history/{empCode}")]
    public async Task<IActionResult> History(string empCode)
    {
        var data = await _service.GetLeaveHistoryAsync(empCode);
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
