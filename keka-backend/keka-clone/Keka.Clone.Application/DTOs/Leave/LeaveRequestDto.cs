using System;

namespace Keka.Clone.Application.DTOs
{
    public class LeaveRequestDto
    {
        public Guid EmployeeId { get; set; } // Fixed: Changed int to Guid
        public int LeaveTypeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; }
    }
}