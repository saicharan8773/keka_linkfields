using System;
using Microsoft.AspNetCore.Mvc;
using Keka.Clone.Application.DTOs;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR,Manager,Employee")]

public class LeaveController : ControllerBase
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
        return Ok(new { message = "Leave applied successfully." });
    }

    [HttpPost("approve")]
    public async Task<IActionResult> ApproveLeaveRequest([FromBody] ApproveLeaveRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.RequestCode))
            return BadRequest(new { message = "RequestCode is required." });

        await _service.ApproveLeaveByCodeAsync(request.RequestCode);
        return Ok(new { message = "Leave approved successfully.", requestCode = request.RequestCode });
    }

    [HttpPost("reject")]
    public async Task<IActionResult> RejectLeaveRequest([FromBody] RejectLeaveRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.RequestCode))
            return BadRequest(new { message = "RequestCode is required." });

        // Note: rejection note can be stored if the service supports it
        await _service.RejectLeaveByCodeAsync(request.RequestCode);
        return Ok(new { message = "Leave rejected successfully.", requestCode = request.RequestCode });
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

public class ApproveLeaveRequest
{
    public string RequestCode { get; set; }
}

public class RejectLeaveRequest
{
    public string RequestCode { get; set; }
    public string Note { get; set; }
}
