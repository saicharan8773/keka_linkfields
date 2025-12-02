using System;

namespace Keka.Clone.Application.DTOs
{
    public class LeaveHistoryItemDto
    {
        public int RequestId { get; set; }
        public string RequestCode { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public string LeaveTypeNote { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalDays { get; set; }
        public string Status { get; set; } = string.Empty;
        public string StatusDetail { get; set; } = string.Empty;
        public string RequestedBy { get; set; } = string.Empty;
        public DateTime RequestedOn { get; set; }
        public DateTime? ActionedOn { get; set; }
        public string Note { get; set; } = string.Empty;
    }
}

