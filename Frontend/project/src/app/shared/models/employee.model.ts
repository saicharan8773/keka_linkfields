export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Designation {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface ManagerInfo {
  id: string;
  displayName: string;
}

export interface Employee {
  id: string;
  employeeCode: string;

  firstName: string;
  middleName: string | null;
  lastName: string;
  displayName: string | null;

  workEmail: string;
  personalEmail: string | null;

  mobileNumber: string | null;
  workNumber: string | null;
  residenceNumber: string | null;

  dateOfBirth: string | null;
  gender: string | null;
  maritalStatus: string | null;
  bloodGroup: string | null;
  isPhysicallyHandicapped: boolean | null;
  nationality: string | null;

  joiningDate: string;
  role: string;

  // Job & org
  designationId: string | null;
  designation: Designation | null;

  departmentId: string | null;
  department: Department | null;
  departmentPath: string | null;

  managerId: string | null;
  manager: ManagerInfo | null;

  locationId: string | null;
  location: Location | null;

  jobTitlePrimary: string | null;
  jobTitleSecondary: string | null;

  isInProbation: boolean | null;
  probationStartDate: string | null;
  probationEndDate: string | null;

  noticePeriod: string | null;
  employmentType: string;
  timeType: string | null;
  contractStatus: string | null;

  payBand: string | null;
  payGrade: string | null;
  businessUnit: string | null;
  costCenter: string | null;
  legalEntity: string | null;

  salaryStructureId: string | null;
  salaryStructure: any | null;

  // Attendance & policies
  shift: string | null;
  weeklyOffPolicy: string | null;
  leavePlan: string | null;
  holidayCalendar: string | null;
  attendanceNumber: string | null;
  disableAttendanceTracking: boolean;
  attendanceCaptureScheme: string | null;
  shiftWeeklyOffRule: string | null;
  overtimePolicy: string | null;
  attendancePenalisationPolicy: string | null;
  shiftAllowancePolicy: string | null;

  tenantId: string;
  photoUrl: string | null;
  address: string | null;

  directReports: Employee[];

  // Relationships
  leaveRequests: LeaveRequest[];
}

// Payload for Creating an Employee
export interface EmployeeCreatePayload {
  employeeCode: string;
  firstName: string;
  lastName: string;
  displayName: string;
  workEmail: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  joiningDate: string;
  role: string;
  designationId: string;
  departmentId: string;
  managerId: string;
  locationId: string;
  employmentType: string;
  timeType: string;
  salaryStructureId: string;
}

// Update Payload matching C# UpdateEmployeeRequest DTO
export interface EmployeeUpdatePayload {
  employeeCode?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  workEmail?: string | null;
  personalEmail?: string | null;
  mobileNumber?: string | null;
  workNumber?: string | null;
  residenceNumber?: string | null;
  dateOfBirth?: string | null; // C#: DateTime?
  gender?: string | null;
  maritalStatus?: string | null;
  bloodGroup?: string | null;
  isPhysicallyHandicapped?: boolean | null; // C#: bool?
  nationality?: string | null;
  joiningDate?: string | null; // C#: DateTime?
  role: string | null;
  designationId?: string | null; // C#: Guid?
  departmentId?: string | null; // C#: Guid?
  departmentPath?: string | null;
  managerId?: string | null; // C#: Guid?
  locationId?: string | null; // C#: Guid?
  jobTitlePrimary?: string | null;
  jobTitleSecondary?: string | null;
  isInProbation?: boolean | null; // C#: bool?
  probationStartDate?: string | null; // C#: DateTime?
  probationEndDate?: string | null; // C#: DateTime?
  noticePeriod?: string | null;
  employmentType?: string | null;
  timeType?: string | null;
  contractStatus?: string | null;
  payBand?: string | null;
  payGrade?: string | null;
  businessUnit?: string | null;
  costCenter?: string | null;
  legalEntity?: string | null;
  salaryStructureId?: string | null; // C#: Guid?
  shift?: string | null;
  weeklyOffPolicy?: string | null;
  leavePlan?: string | null;
  holidayCalendar?: string | null;
  attendanceNumber?: string | null;
  disableAttendanceTracking?: boolean | null; // C#: bool?
  attendanceCaptureScheme?: string | null;
  shiftWeeklyOffRule?: string | null;
  overtimePolicy?: string | null;
  attendancePenalisationPolicy?: string | null;
  shiftAllowancePolicy?: string | null;
  photoUrl?: string | null;
  address?: string | null;
}
