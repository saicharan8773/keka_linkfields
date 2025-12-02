using Keka.Clone.Application.DTOs.Attendance;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Keka.Clone.Application.Interfaces
{
    public interface IAttendanceService
    {
        Task<(bool inGeofence, string message)> TryLoginAsync(Guid userId, DateTime utcNow, double lat, double lng);
        Task<(bool ok, string message)> TryLogoutAsync(Guid userId, DateTime utcNow, double lat, double lng);
        Task<List<MonthlyAttendanceDto>> GetMonthlyAsync(Guid userId, int year, int month);
    }
}
