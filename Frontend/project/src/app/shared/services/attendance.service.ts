import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateRequest } from "../models/CreateRequest.model";

@Injectable({ providedIn: "root" })
export class AttendanceService {
  private base = 'https://localhost:7225/api/Attendance';
  private requestbase = 'https://localhost:7225/api/Leave/request';
  
  private Managerlist = 'https://localhost:7225/api/Users/managers';
  constructor(private http: HttpClient) { }

  login(userId: string, lat: number, lng: number) {
    return this.http.post(`${this.base}/login`, { userId, lat, lng });
  }
  logout(userId: string, lat: number, lng: number) {
    return this.http.post(`${this.base}/logout`, { userId, lat, lng });
  }
  monthly(userId: string, month: string) {
    return this.http.get(`${this.base}/monthly`, { params: { userId, month } });
  }
  SubmitLeaveRequest(request: CreateRequest): Observable<any> {
    return this.http.post<any>(this.requestbase, request);
  }

  getManagers(): Observable<any> {
    return this.http.get<any>(this.Managerlist);
  }
}