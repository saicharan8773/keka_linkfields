import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeAnniversary {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    workEmail: string;
    joiningDate: string;
    yearsCompleted: number;
    anniversaryMessage: string;
    departmentName?: string;
    designationTitle?: string;
}

export interface Employee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    workEmail: string;
    joiningDate: string;
    departmentName?: string;
    designationTitle?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private readonly ANALYTICS_API = 'https://localhost:7225/api/Analytics';

    constructor(private http: HttpClient) { }

    getTodayAnniversaries(): Observable<EmployeeAnniversary[]> {
        return this.http.get<EmployeeAnniversary[]>(`${this.ANALYTICS_API}/anniversaries/today`);
    }

    getUpcomingAnniversaries(daysAhead: number = 15): Observable<EmployeeAnniversary[]> {
        return this.http.get<EmployeeAnniversary[]>(`${this.ANALYTICS_API}/anniversaries/upcoming?daysAhead=${daysAhead}`);
    }

    getNewJoinees(daysBack: number = 30): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.ANALYTICS_API}/new-joinees?daysBack=${daysBack}`);
    }
}
