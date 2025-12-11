import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  LeaveApplicationPayload,
  LeaveDecisionPayload,
  LeaveRequest,
  LeaveType,
  LeaveHistoryItemDto,
  PendingLeaveRequest,
  ApproveLeavePayload,
  RejectLeavePayload,
} from "../models/leave.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class LeaveService {
  private readonly API_URL = "https://localhost:7225/api/Leave";
  private readonly LEAVE_REQUESTS_URL =
    "https://localhost:7225/api/Leave/apply";
  private readonly EMPLOYEE_URL = "https://localhost:7225/api/Employee";
  private readonly ANALYTICS_URL = "https://localhost:7225/api/Analytics";
  private apiUrl = "https://localhost:7225/api";
  constructor(private http: HttpClient, private authService: AuthService) {}

  applyLeave(payload: LeaveApplicationPayload): Observable<void> {
    return this.http.post<void>(this.LEAVE_REQUESTS_URL, payload);
  }

  getMyLeaveRequests(): Observable<LeaveRequest[]> {
    const id = this.authService.getEmployeeId() || "";
    return this.http.get<LeaveRequest[]>(`${this.API_URL}/my/${id}`);
  }

  getTeamLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.API_URL}/team`);
  }

  updateLeaveStatus(
    requestId: string,
    payload: LeaveDecisionPayload
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.API_URL}/${requestId}/status`,
      payload
    );
  }

  getLeaveTypes(): Observable<LeaveType[]> {
    const id = this.authService.getEmployeeId() || "";
    if (!id) {
      console.warn(
        "No employee id found in token — calling token-scoped endpoint as fallback."
      );
      // return this.http.get<LeaveType[]>(`${this.API_URL}/types`)
    }
    return this.http.get<LeaveType[]>(`${this.API_URL}/types/${id}`);
  }

  /**
   * Fetch leave types using an explicit policy/company GUID.
   * Example: GET /api/Leave/types/{policyGuid}
   */
  getLeaveTypesByGuid(policyId: string): Observable<LeaveType[]> {
    if (!policyId) {
      return this.getLeaveTypes();
    }
    return this.http.get<LeaveType[]>(`${this.API_URL}/types/${policyId}`);
  }

  /**
   * Get leave history for an employee by empiid (path param expected by API as empCode)
   * GET /api/Leave/history/{empiid}
   */
  getLeaveHistory(empiid: string): Observable<LeaveHistoryItemDto[]> {
    if (!empiid)
      return this.http.get<LeaveHistoryItemDto[]>(`${this.API_URL}/history`);
    return this.http.get<LeaveHistoryItemDto[]>(
      `${this.API_URL}/history/${empiid}`
    );
  }

  /**
   * Returns leave balances for the current user.
   * Endpoint: GET /api/Leave/balances/{employeeId}
   */
  getLeaveBalances(): Observable<any> {
    const id = this.authService.getEmployeeId() || "";
    if (!id) {
      return this.http.get<any>(`${this.API_URL}/balances`);
    }
    return this.http.get<any>(`${this.API_URL}/balances/${id}`);
  }

  /**
   * Returns remaining/pending balance for a specific leave type for an employee.
   * Endpoint: GET /api/Leave/balance/{empId}/{leaveTypeId}
   */
  getLeaveBalanceForType(
    empId: string,
    leaveTypeId: number
  ): Observable<number> {
    console.log("Getting balance for type:", leaveTypeId);
    console.log("Employee ID:", empId);
    console.log("API URL:", `${this.API_URL}/balance/${empId}/${leaveTypeId}`);
    return this.http.get<number>(
      `${this.API_URL}/balance/${empId}/${leaveTypeId}`
    );
  }

  getServerTime(): Observable<{ currentTime: string } | any> {
    return this.http.get<any>(`${this.API_URL}/time`);
  }

  getLeaveStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/stats`);
  }

  getEmployeesOnLeaveToday(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/on-leave-today`);
  }

  getCelebrations(): Observable<any> {
    return this.http.get<any>(`${this.EMPLOYEE_URL}/celebrations`);
  }
  getWeeklyApprovedPatterns(employeeId: string): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/Analytics/weekly-approved/${employeeId}`
    );
  }

  getConsumedLeaveTypesStats(
    employeeId: string
  ): Observable<{ name: string; value: number }[]> {
    return this.http.get<{ name: string; value: number }[]>(
      `${this.apiUrl}/Analytics/consumed-leave-types/${employeeId}`
    );
  }

  getMonthlyApprovedStats(employeeId: string): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/Analytics/monthly-stats/${employeeId}`
    );
  }

  getPendingLeaves(): Observable<PendingLeaveRequest[]> {
    return this.http.get<PendingLeaveRequest[]>(`${this.API_URL}/pending`);
  }

  approveLeave(payload: ApproveLeavePayload): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/approve`, payload);
  }

  /**
   * Reject a leave request
   * POST https://localhost:7225/api/Leave/reject
   * BODY: { "requestCode": "<row.requestCode>", "note": "<rejection note>" }
   */
  rejectLeave(payload: RejectLeavePayload): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/reject`, payload);
  }
}
