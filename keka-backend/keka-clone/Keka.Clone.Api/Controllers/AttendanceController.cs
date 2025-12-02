using Keka.Clone.Application.DTOs.Attendance;
using Keka.Clone.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Keka.Clone.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly AttendanceService _svc;
        public AttendanceController(AttendanceService svc) { _svc = svc; }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] GeoDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out Guid userId))
                return Unauthorized("Invalid userId in token");

            var now = DateTime.UtcNow;
            var istZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            var istNow = TimeZoneInfo.ConvertTimeFromUtc(now, istZone);


            var (inFence, msg) = await _svc.TryLoginAsync(userId, istNow, dto.Lat, dto.Lng);

            if (!inFence)
                return BadRequest(new { success = false, message = msg });
            return Ok(new { success = true, message = msg, timeUtc = istNow });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] GeoDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out Guid userId))
                return Unauthorized("Invalid userId in token");

            var now = DateTime.UtcNow;
            var istZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            var istNow = TimeZoneInfo.ConvertTimeFromUtc(now, istZone);
            var (ok, msg) = await _svc.TryLogoutAsync(userId, istNow, dto.Lat, dto.Lng);

            if (!ok)
                return BadRequest(new { success = false, message = msg });

            return Ok(new { success = true, message = msg, timeUtc = istNow });
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthly(Guid userId, string month) // month = "2025-11"
        {
            if (!DateTime.TryParse($"{month}-01", out var start)) return BadRequest("invalid month");
            var list = await _svc.GetMonthlyAsync(userId, start.Year, start.Month);
            return Ok(list);
        }
    }
}
