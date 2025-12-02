using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.DTOs.Attendance
{
    public class CreateLeaveRequestDto
    {
        public string LeaveType { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsHalfDay { get; set; }
        public Guid ManagerId { get; set; }
        public string Reason { get; set; } = null!;
        public string? AttachmentUrl { get; set; }
    }
}
