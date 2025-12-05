using Microsoft.AspNetCore.Mvc;
using Keka.Clone.Application.Interfaces;
using System.Security.Claims;

namespace Keka.Clone.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ILeaveService _service;

        public AnalyticsController(ILeaveService service)
        {
            _service = service;
        }

        [HttpGet("weekly-approved/{employeeId:guid}")]
        public async Task<IActionResult> GetWeeklyApproved(Guid employeeId)
        {
            var data = await _service.GetWeeklyApprovedPatternsAsync(employeeId);
            return Ok(data);
        }

        [HttpGet("consumed-leave-types/{employeeId:guid}")]
        public async Task<IActionResult> GetConsumedLeaveTypes(Guid employeeId)
        {
            var data = await _service.GetConsumedLeaveTypesStatsAsync(employeeId);
            // Transform dictionary to list of objects for frontend: { name: string, value: number }
            var result = data.Select(kv => new { name = kv.Key, value = kv.Value }).ToList();
            return Ok(result);
        }

        [HttpGet("monthly-stats/{employeeId:guid}")]
        public async Task<IActionResult> GetMonthlyStats(Guid employeeId)
        {
            var data = await _service.GetMonthlyApprovedStatsAsync(employeeId);
            return Ok(data);
        }


    }
}
