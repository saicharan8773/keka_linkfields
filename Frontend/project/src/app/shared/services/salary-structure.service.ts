import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SalaryStructure, SalaryStructureCreatePayload, SalaryStructureUpdatePayload } from "../models/salary-structure.model";

@Injectable({
    providedIn: "root",
})
export class SalaryStructureService {
    private readonly API_URL = "https://localhost:7225/api/SalaryStructures";

    constructor(private http: HttpClient) { }

    getAllSalaryStructures(): Observable<SalaryStructure[]> {
        return this.http
            .get<{ items: SalaryStructure[] }>(this.API_URL)
            .pipe(map((res) => res.items));
    }

    getSalaryStructureById(id: string): Observable<SalaryStructure> {
        return this.http.get<SalaryStructure>(`${this.API_URL}/${id}`);
    }

    createSalaryStructure(data: SalaryStructureCreatePayload): Observable<SalaryStructure> {
        return this.http.post<SalaryStructure>(this.API_URL, data);
    }

    updateSalaryStructure(id: string, data: SalaryStructureUpdatePayload): Observable<SalaryStructure> {
        return this.http.put<SalaryStructure>(`${this.API_URL}/${id}`, data);
    }

    deleteSalaryStructure(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
