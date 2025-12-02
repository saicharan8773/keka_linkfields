import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Attendance, PunchRequest } from "../models/attendance.model";

@Injectable({ providedIn: "root" })
export class AttendanceService {
  private readonly API_BASE = "https://localhost:7225/api/Attendance";

  constructor(private http: HttpClient) {}

  punchIn(request: PunchRequest): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.API_BASE}/punch-in`, request);
  }

  punchOut(request: PunchRequest): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.API_BASE}/punch-out`, request);
  }
}
