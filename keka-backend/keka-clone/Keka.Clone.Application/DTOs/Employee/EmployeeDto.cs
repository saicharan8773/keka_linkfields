namespace Keka.Clone.Application.DTOs.Employee;

public class EmployeeDto
{
    public Guid Id { get; set; }
    public string EmployeeCode { get; set; } = null!;

    // Primary details
    public string FirstName { get; set; } = null!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = null!;
    public string? DisplayName { get; set; }
    public string WorkEmail { get; set; } = null!;
    public string? PersonalEmail { get; set; }
    public string? MobileNumber { get; set; }
    public string? WorkNumber { get; set; }
    public string? ResidenceNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? MaritalStatus { get; set; }
    public string? BloodGroup { get; set; }
    public bool? IsPhysicallyHandicapped { get; set; }
    public string? Nationality { get; set; }
    public DateTime JoiningDate { get; set; }

    // Job & organization
    public Guid? DesignationId { get; set; }
    public Guid? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string? DepartmentPath { get; set; }
    public Guid? ManagerId { get; set; }
    public string? ManagerName { get; set; }
    public string? ManagerOfManagerName { get; set; }
    public Guid? LocationId { get; set; }
    public string? LocationName { get; set; }
    public string? BusinessUnit { get; set; }
    public string? CostCenter { get; set; }
    public string? LegalEntity { get; set; }
    public string? JobTitlePrimary { get; set; }
    public string? JobTitleSecondary { get; set; }
    public bool? IsInProbation { get; set; }
    public DateTime? ProbationStartDate { get; set; }
    public DateTime? ProbationEndDate { get; set; }
    public string? NoticePeriod { get; set; }
    public string EmploymentType { get; set; } = null!;
    public string? TimeType { get; set; }
    public string? ContractStatus { get; set; }
    public string? PayBand { get; set; }
    public string? PayGrade { get; set; }

    public Guid? SalaryStructureId { get; set; }

    // Employee time section
    public string? Shift { get; set; }
    public string? WeeklyOffPolicy { get; set; }
    public string? LeavePlan { get; set; }
    public string? HolidayCalendar { get; set; }
    public string? AttendanceNumber { get; set; }
    public bool DisableAttendanceTracking { get; set; }
    public string? AttendanceCaptureScheme { get; set; }
    public string? ShiftWeeklyOffRule { get; set; }
    public string? OvertimePolicy { get; set; }
    public string? AttendancePenalisationPolicy { get; set; }
    public string? ShiftAllowancePolicy { get; set; }

    // Misc
    public string? ProjectName { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Address { get; set; }
    public string? CustomFieldsJson { get; set; }
}
