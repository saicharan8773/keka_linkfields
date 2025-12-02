using System;

namespace Keka.Clone.Application.DTOs
{
    public class LeaveTypeAvailabilityDto
    {
        public int LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = string.Empty;
        public string AvailabilityLabel { get; set; } = string.Empty;
        public int? RemainingDays { get; set; }
        public bool IsUnlimited { get; set; }
        public bool IsSelectable => IsUnlimited || (RemainingDays ?? 0) > 0;
    }
}

