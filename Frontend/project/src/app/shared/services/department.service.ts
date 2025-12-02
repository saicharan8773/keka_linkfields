import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Department, DepartmentCreatePayload, DepartmentUpdatePayload } from "../models/department.model";

@Injectable({
    providedIn: "root",
})
export class DepartmentService {
    private readonly API_URL = "https://localhost:7225/api/Departments";

    constructor(private http: HttpClient) { }

    getAllDepartments(): Observable<Department[]> {
        return this.http
            .get<Department[] | { items: Department[] }>(this.API_URL)
            .pipe(
                map((res) => (Array.isArray(res) ? res : res.items ?? []))
            );
    }

    getDepartmentById(id: string): Observable<Department> {
        return this.http.get<Department>(`${this.API_URL}/${id}`);
    }

    createDepartment(data: DepartmentCreatePayload): Observable<Department> {
        return this.http.post<Department>(this.API_URL, data);
    }

    updateDepartment(id: string, data: DepartmentUpdatePayload): Observable<Department> {
        return this.http.put<Department>(`${this.API_URL}/${id}`, data);
    }

    deleteDepartment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
