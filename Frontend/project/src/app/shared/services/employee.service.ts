import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  Employee,
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
} from "../models/employee.model";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private readonly EMP_API = "https://localhost:7225/api/Employees";

  constructor(private http: HttpClient) { }

  getAllEmployees(
    filters: {
      query?: string;
      departmentId?: string;
      designationId?: string;
      locationId?: string;
      employmentType?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Observable<Employee[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      const val = (filters as any)[key];
      if (val !== null && val !== undefined && val !== "") {
        params = params.set(key.charAt(0).toUpperCase() + key.slice(1), val);
      }
    });

    return this.http.get<any>(this.EMP_API, { params }).pipe(
      map((res) => {
        // Support API responses that use either `Items` (capitalized)
        // or `items` (lowercase) as well as returning an array directly.
        if (!res) return [];
        if (Array.isArray(res)) return res as Employee[];
        return (res.Items || res.items || []) as Employee[];
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.EMP_API}/${id}`);
  }

  createEmployee(data: EmployeeCreatePayload): Observable<Employee> {
    return this.http.post<Employee>(this.EMP_API, data);
  }

  updateEmployee(
    id: string,
    data: EmployeeUpdatePayload
  ): Observable<Employee> {
    return this.http.patch<Employee>(`${this.EMP_API}/${id}`, data);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.EMP_API}/${id}`);
  }
}
