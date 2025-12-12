namespace Keka.Clone.Domain.Entities;

public class LeaveType
{
    public int Id { get; set; }
    public string Code { get; set; } = null!;  // CL, SL, EL, etc.
    public string Name { get; set; } = null!;  // Sick, Casual, etc.
    public int DefaultDays { get; set; }
    public bool IsUnlimited { get; set; }
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
}
