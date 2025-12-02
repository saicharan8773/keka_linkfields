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
}
