import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Team,
    TeamCreatePayload,
    TeamUpdatePayload,
    AssignEmployeeToTeamPayload,
    TeamEmployee
} from '../models/team.model';

@Injectable({
    providedIn: 'root',
})
export class TeamService {
    private readonly TEAM_API = 'https://localhost:7225/api/Teams';
    private readonly EMPLOYEE_API = 'https://localhost:7225/api/Employees';

    constructor(private http: HttpClient) { }

    /**
     * Get all teams with optional filters
     */
    getAllTeams(filters: {
        query?: string;
        page?: number;
        pageSize?: number;
    } = {}): Observable<Team[]> {
        let params = new HttpParams();

        Object.keys(filters).forEach((key) => {
            const val = (filters as any)[key];
            if (val !== null && val !== undefined && val !== '') {
                params = params.set(key.charAt(0).toUpperCase() + key.slice(1), val);
            }
        });

        return this.http.get<any>(this.TEAM_API, { params }).pipe(
            map((res) => {
                if (!res) return [];
                if (Array.isArray(res)) return res as Team[];
                return (res.Items || res.items || []) as Team[];
            })
        );
    }

    /**
     * Get a single team by ID
     */
    getTeamById(id: string): Observable<Team> {
        return this.http.get<Team>(`${this.TEAM_API}/${id}`);
    }

    /**
     * Get employees in a specific team
     */
    getTeamEmployees(teamId: string): Observable<TeamEmployee[]> {
        return this.http.get<any>(`${this.TEAM_API}/${teamId}/employees`).pipe(
            map((res) => {
                if (!res) return [];
                if (Array.isArray(res)) return res as TeamEmployee[];
                return (res.Items || res.items || []) as TeamEmployee[];
            })
        );
    }

    /**
     * Get employees without a team (available for assignment)
     */
    getEmployeesWithoutTeam(): Observable<TeamEmployee[]> {
        return this.http.get<any>(`${this.EMPLOYEE_API}`).pipe(
            map((res) => {
                if (!res) return [];
                if (Array.isArray(res)) return res as TeamEmployee[];
                return (res.Items || res.items || []) as TeamEmployee[];
            })
        );
    }

    /**
     * Create a new team
     */
    createTeam(data: TeamCreatePayload): Observable<Team> {
        return this.http.post<Team>(this.TEAM_API, data);
    }

    /**
     * Update an existing team
     */
    updateTeam(id: string, data: TeamUpdatePayload): Observable<Team> {
        return this.http.put<Team>(`${this.TEAM_API}/${id}`, data);
    }

    /**
     * Delete a team
     */
    deleteTeam(id: string): Observable<void> {
        return this.http.delete<void>(`${this.TEAM_API}/${id}`);
    }

    /**
     * Assign an employee to a team
     */
    assignEmployeeToTeam(
        employeeId: string,
        payload: AssignEmployeeToTeamPayload
    ): Observable<void> {
        return this.http.put<void>(
            `${this.EMPLOYEE_API}/${employeeId}/assign-team`,
            payload
        );
    }

    /**
     * Remove an employee from a team
     */
    removeEmployeeFromTeam(employeeId: string): Observable<void> {
        return this.http.put<void>(
            `${this.EMPLOYEE_API}/${employeeId}/assign-team`,
            { teamId: null }
        );
    }
}
