export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus | number;
  managerComment?: string;
}

export interface LeaveApplicationPayload {
  employeeId: string;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveDecisionPayload {
  status: Exclude<LeaveStatus, "Pending">;
  comment?: string;
}

export interface LeaveType {
  leaveTypeId: number;
  leaveTypeName: string;
  availabilityLabel: string;
  remainingDays: number;
  isSelectable: boolean;
  isUnlimited: boolean;
  // Alias for easier usage if needed, or stick to backend names
  id?: number;
  name?: string;
}

export interface LeaveTypeAvailabilityDto {
  leaveTypeId: number;
  leaveTypeName: string;
  availabilityLabel: string;
  remainingDays: number;
  isUnlimited: boolean;
  isSelectable: boolean;
  // UI specific fields
  consumed?: number;
  accrued?: number;
  annualQuota?: number | string;
}

export interface LeaveHistoryItemDto {
  requestId: number;
  requestCode: string;
  leaveType: string;
  leaveTypeNote: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  totalDays: number;
  status: string;
  statusDetail: string;
  requestedBy: string;
  requestedOn: string;
  actionedOn?: string;
  note: string;
}
