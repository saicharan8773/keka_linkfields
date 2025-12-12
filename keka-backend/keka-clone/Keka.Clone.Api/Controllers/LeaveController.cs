using System;
using Microsoft.AspNetCore.Mvc;
using Keka.Clone.Application.DTOs;
using Keka.Clone.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Keka.Clone.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,HR,Manager,Employee")]

public class LeaveController : ControllerBase
{
    private readonly ILeaveService _service;
    private readonly ILeaveRequestRepository _requestRepository;
    private readonly ILogger<LeaveController> _logger;

    public LeaveController(ILeaveService service, ILeaveRequestRepository requestRepository, ILogger<LeaveController> logger)
    {
        _service = service;
        _requestRepository = requestRepository;
        _logger = logger;
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

    [HttpPost("approve")]
    public async Task<IActionResult> ApproveLeaveRequest([FromBody] ApproveLeaveRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.RequestCode))
            return BadRequest(new { message = "RequestCode is required." });

        await _service.ApproveLeaveByCodeAsync(request.RequestCode,request.RequestMessage);
        return Ok(new { message = "Leave approved successfully.", requestCode = request.RequestCode });
    }

    [HttpPost("reject")]
    public async Task<IActionResult> RejectLeaveRequest([FromBody] RejectLeaveRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.RequestCode))
            return BadRequest(new { message = "RequestCode is required." });

        // Note: rejection note can be stored if the service supports it
        await _service.RejectLeaveByCodeAsync(request.RequestCode, request.Note);
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

    [HttpGet("EmployeesOnLeave")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOnLeave(DateTime date)
    {
        _logger.LogInformation("GetOnLeave endpoint called with date: {Date}", date);
        var employees = await _service.GetEmployeesOnLeaveAsync(date);
        _logger.LogInformation("Found {Count} employees on leave for date: {Date}", employees.Count(), date);
        return Ok(employees);
    }
}

public class ApproveLeaveRequest
{
    public string RequestCode { get; set; }
    public string RequestMessage { get; set; }
}

public class RejectLeaveRequest
{
    public string RequestCode { get; set; }
    public string Note { get; set; }
}
