import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

 base = 'https://localhost:7225/api';

  constructor(private http: HttpClient) {}

  getDepartments() {
    return this.http.get<any[]>(`${this.base}/Departments`);
  }

  getDesignations() {
    return this.http.get<any[]>(`${this.base}/Designations`);
  }

  getLocations() {
    return this.http.get<any[]>(`${this.base}/Locations`);
  }

  getManagers() {
    return this.http.get<any[]>(`${this.base}/Employee/Managers`);
  }
}
