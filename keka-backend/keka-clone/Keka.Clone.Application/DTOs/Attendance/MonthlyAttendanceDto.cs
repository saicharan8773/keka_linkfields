using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.DTOs.Attendance
{
    public class MonthlyAttendanceDto
    {
        public DateTime Date { get; set; }
        public DateTime? Login { get; set; }
        public DateTime? Logout { get; set; }
        public double? WorkedHours { get; set; }
        public string Status { get; set; }
    }
}
