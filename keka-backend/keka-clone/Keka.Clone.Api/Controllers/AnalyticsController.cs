using Microsoft.AspNetCore.Mvc;
using Keka.Clone.Application.Interfaces;
using System.Security.Claims;

namespace Keka.Clone.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ILeaveService _leaveService;
        private readonly IEmployeeService _employeeService;

        public AnalyticsController(ILeaveService leaveService, IEmployeeService employeeService)
        {
            _leaveService = leaveService;
            _employeeService = employeeService;
        }

        [HttpGet("weekly-approved/{employeeId:guid}")]
        public async Task<IActionResult> GetWeeklyApproved(Guid employeeId)
        {
            var data = await _leaveService.GetWeeklyApprovedPatternsAsync(employeeId);
            return Ok(data);
        }

        [HttpGet("consumed-leave-types/{employeeId:guid}")]
        public async Task<IActionResult> GetConsumedLeaveTypes(Guid employeeId)
        {
            var data = await _leaveService.GetConsumedLeaveTypesStatsAsync(employeeId);
            // Transform dictionary to list of objects for frontend: { name: string, value: number }
            var result = data.Select(kv => new { name = kv.Key, value = kv.Value }).ToList();
            return Ok(result);
        }

        [HttpGet("monthly-stats/{employeeId:guid}")]
        public async Task<IActionResult> GetMonthlyStats(Guid employeeId)
        {
            var data = await _leaveService.GetMonthlyApprovedStatsAsync(employeeId);
            return Ok(data);
        }

        [HttpGet("anniversaries/today")]
        public async Task<IActionResult> GetTodayAnniversaries()
        {
            var anniversaries = await _employeeService.GetTodayAnniversariesAsync();
            return Ok(anniversaries);
        }

        [HttpGet("anniversaries/upcoming")]
        public async Task<IActionResult> GetUpcomingAnniversaries([FromQuery] int daysAhead = 15)
        {
            var anniversaries = await _employeeService.GetUpcomingAnniversariesAsync(daysAhead);
            return Ok(anniversaries);
        }

        [HttpGet("new-joinees")]
        public async Task<IActionResult> GetNewJoinees([FromQuery] int daysBack = 30)
        {
            var newJoinees = await _employeeService.GetNewJoineesAsync(daysBack);
            return Ok(newJoinees);
        }

    }
}
