import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Designation, DesignationCreatePayload, DesignationUpdatePayload } from "../models/designation.model";

@Injectable({
    providedIn: "root",
})
export class DesignationService {
    private API_URL = "https://localhost:7225/api/Designations";

    constructor(private http: HttpClient) { }

    getAllDesignations(): Observable<Designation[]> {
        return this.http
            .get<Designation[] | { items: Designation[] }>(this.API_URL)
            .pipe(
                map((res) => (Array.isArray(res) ? res : res.items ?? []))
            );
    }

    getDesignationsByDepartment(departmentId: string): Observable<Designation[]> {
        return this.http
            .get<Designation[] | { items: Designation[] }>(`${this.API_URL}?departmentId=${departmentId}`)
            .pipe(
                map((res) => (Array.isArray(res) ? res : res.items ?? []))
            );
    }

    getDesignationById(id: string): Observable<Designation> {
        return this.http.get<Designation>(`${this.API_URL}/${id}`);
    }

    createDesignation(data: DesignationCreatePayload): Observable<Designation> {
        return this.http.post<Designation>(this.API_URL, data);
    }

    updateDesignation(id: string, data: DesignationUpdatePayload): Observable<Designation> {
        return this.http.put<Designation>(`${this.API_URL}/${id}`, data);
    }

    deleteDesignation(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
