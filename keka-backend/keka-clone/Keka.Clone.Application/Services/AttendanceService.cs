using Keka.Clone.Application.DTOs.Attendance;
using Keka.Clone.Application.Helpers;
using Keka.Clone.Domain.Entities;
using Keka.Clone.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.Services
{
    public class AttendanceService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AttendanceService(AppDbContext db, IConfiguration config) { _db = db; _config = config; }

        private (double lat, double lng, double radius) GetOffice()
        {
            var lat = double.Parse(_config["Attendance:OfficeLat"]);
            var lng = double.Parse(_config["Attendance:OfficeLng"]);
            var radius = double.Parse(_config["Attendance:OfficeRadiusMeters"]);
            return (lat, lng, radius);
        }

        public async Task<(bool inGeofence, string message)> TryLoginAsync(Guid userId, DateTime utcNow, double lat, double lng)
        {
            var (olat, olng, r) = GetOffice();
            var distance = GeoUtils.HaversineDistanceMeters(olat, olng, lat, lng);
            if (distance > r) return (false, "Outside office boundary");
                
            var date = utcNow.Date;
            var att = await _db.Attendances.FirstOrDefaultAsync(a => a.UserId == userId && a.Date == date);
            if (att == null)
            {
                att = new Attendance { UserId = userId, Date = date, LoginTimeUtc = utcNow, LoginLat = lat, LoginLng = lng };
                _db.Attendances.Add(att);
            }
            else
            {
                att.LoginTimeUtc = utcNow;
                att.LoginLat = lat;
                att.LoginLng = lng;
            }
            await _db.SaveChangesAsync();
            return (true, "Login recorded");
        }

        public async Task<(bool ok, string message)> TryLogoutAsync(Guid userId, DateTime utcNow, double lat, double lng)
        {
            var date = utcNow.Date;
            var att = await _db.Attendances.FirstOrDefaultAsync(a => a.UserId == userId && a.Date == date);
            if (att == null || att.LoginTimeUtc == null) return (false, "No login found for today");

            att.LogoutTimeUtc = utcNow;
            att.LogoutLat = lat;
            att.LogoutLng = lng;

            var worked = (att.LogoutTimeUtc.Value - att.LoginTimeUtc.Value).TotalHours;
            if (worked < 0) worked = 0;
            att.WorkedHours = Math.Round(worked, 2);
            await _db.SaveChangesAsync();
            return (true, "Logout recorded");
        }

        public async Task<List<MonthlyAttendanceDto>> GetMonthlyAsync(Guid userId, int year, int month)
        {
            var start = new DateTime(year, month, 1);
            var end = start.AddMonths(1);
            var records = await _db.Attendances
                         .Where(a => a.UserId == userId && a.Date >= start && a.Date < end)
                         .ToListAsync();

            var list = new List<MonthlyAttendanceDto>();
            var daysInMonth = DateTime.DaysInMonth(year, month);
            for (int d = 1; d <= daysInMonth; d++)
            {
                var dt = new DateTime(year, month, d);
                var rec = records.FirstOrDefault(r => r.Date == dt);
                string status;
                double? hours = null;
                if (rec == null) status = "Leave";
                else
                {
                    hours = rec.WorkedHours ?? 0;
                    if (hours >= 8) status = "Full Day";
                    else if (hours >= 4) status = "Half Day";
                    else status = "Leave";
                }
                list.Add(new MonthlyAttendanceDto { Date = dt, Login = rec?.LoginTimeUtc, Logout = rec?.LogoutTimeUtc, WorkedHours = hours, Status = status });
            }
            return list;
        }
    }
}
