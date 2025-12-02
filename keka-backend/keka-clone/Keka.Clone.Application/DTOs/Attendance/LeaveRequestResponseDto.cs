using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.DTOs.Attendance
{
    public class LeaveRequestResponseDto
    {
        public Guid Id { get; set; }
        public string EmployeeName { get; set; }
        public string LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
        public string Reason { get; set; }
    }
}
