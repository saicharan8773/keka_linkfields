using System;

namespace Keka.Clone.Domain.Entities
{
    public class EmployeeLeaveAllocation
    {
        public int Id { get; set; }
        public Employee Employee { get; set; } // Fixed: Added missing navigation property
        public Guid EmployeeId { get; set; } // Fixed: int -> Guid
        public int LeaveTypeId { get; set; }

        public int Year { get; set; }
        public int RemainingDays { get; set; }
    }
}
