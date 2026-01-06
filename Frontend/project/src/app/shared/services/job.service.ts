import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, CreateJobRequest, UpdateJobRequest, JobSearchParams } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private readonly API_URL = 'https://localhost:7225/api/jobs';

    constructor(private http: HttpClient) { }

    getAllJobs(params: JobSearchParams = {}): Observable<{ items: Job[], total: number, page: number, pageSize: number }> {
        let httpParams = new HttpParams();

        if (params.query) httpParams = httpParams.set('query', params.query);
        if (params.departmentId) httpParams = httpParams.set('departmentId', params.departmentId);
        if (params.designationId) httpParams = httpParams.set('designationId', params.designationId);
        if (params.status) httpParams = httpParams.set('status', params.status);
        if (params.employmentType) httpParams = httpParams.set('employmentType', params.employmentType);
        if (params.location) httpParams = httpParams.set('location', params.location);
        if (params.experienceLevel) httpParams = httpParams.set('experienceLevel', params.experienceLevel);
        if (params.page) httpParams = httpParams.set('page', params.page.toString());
        if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
        if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
        if (params.sortDesc !== undefined) httpParams = httpParams.set('sortDesc', params.sortDesc.toString());

        return this.http.get<{ items: Job[], total: number, page: number, pageSize: number }>(this.API_URL, { params: httpParams });
    }

    getJobById(id: string): Observable<Job> {
        return this.http.get<Job>(`${this.API_URL}/${id}`);
    }

    createJob(request: CreateJobRequest): Observable<Job> {
        return this.http.post<Job>(this.API_URL, request);
    }

    updateJob(id: string, request: UpdateJobRequest): Observable<Job> {
        return this.http.put<Job>(`${this.API_URL}/${id}`, request);
    }

    closeJob(id: string): Observable<{ message: string }> {
        return this.http.patch<{ message: string }>(`${this.API_URL}/${id}/close`, {});
    }

    deleteJob(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
