using System.Collections.Generic;

namespace Keka.Clone.Domain.Entities
{
    public class Employee
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string EmployeeCode { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? DisplayName { get; set; }
        public string WorkEmail { get; set; } = null!;
        public string? MobileNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
        public DateTime JoiningDate { get; set; }
        public Guid? DesignationId { get; set; }
        public Designation? Designation { get; set; }
        public Guid? DepartmentId { get; set; }
        public Department? Department { get; set; }
        public Guid? ManagerId { get; set; }
        public User? Manager { get; set; }
        public Guid? LocationId { get; set; }
        public Location? Location { get; set; }
        public string EmploymentType { get; set; } = "FullTime"; // Worker type
        public string? TimeType { get; set; }
        public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
        public ICollection<EmployeeLeaveAllocation> LeaveAllocations { get; set; } = new List<EmployeeLeaveAllocation>();
    }
}