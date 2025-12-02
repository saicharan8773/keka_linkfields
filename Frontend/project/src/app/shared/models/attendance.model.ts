export interface PunchLog {
  id: string;
  employeeId: string;
  attendanceId: string;
  punchType: "IN" | "OUT";
  latitude: number;
  longitude: number;
  isWithinOfficeRadius: boolean;
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  punchInTime: string;
  punchOutTime: string;
  totalHours: number;
  effectiveHours: number | null;
  status: string;
  punchLogs: PunchLog[];
}

export interface PunchRequest {
  employeeId: string;
  latitude: number;
  longitude: number;
}
