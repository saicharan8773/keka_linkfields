using Keka.Clone.Domain.Enums;
using System;

namespace Keka.Clone.Domain.Entities
{
    public class LeaveRequest
    {
        public int Id { get; set; }

        // Human-friendly unique identifier for tracking this leave request (e.g., in UI / emails)
        public string RequestCode { get; set; } = null!;

        public Guid EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        public int LeaveTypeId { get; set; }
        public LeaveType LeaveType { get; set; } = null!;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Reason { get; set; }
        public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

        public DateTime RequestedOn { get; set; } = DateTime.UtcNow;
        public DateTime? ActionDate { get; set; }
    }
}
