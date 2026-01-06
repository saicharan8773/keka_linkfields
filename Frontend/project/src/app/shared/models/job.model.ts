export interface Job {
    id: string;
    title: string;
    jobCode: string;
    departmentId?: string;
    departmentName?: string;
    designationId?: string;
    designationTitle?: string;
    employmentType: string;
    experienceLevel: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    openings: number;
    description: string;
    skills?: string[];
    status: string;
    createdBy: string;
    createdByName: string;
    createdOn: Date;
    updatedBy?: string;
    updatedByName?: string;
    updatedOn?: Date;
}

export interface CreateJobRequest {
    title: string;
    jobCode?: string;
    departmentId?: string;
    designationId?: string;
    employmentType: string;
    experienceLevel: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    openings: number;
    description: string;
    skills?: string[];
    status: string;
}

export interface UpdateJobRequest {
    title: string;
    jobCode: string;
    departmentId?: string;
    designationId?: string;
    employmentType: string;
    experienceLevel: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    openings: number;
    description: string;
    skills?: string[];
    status: string;
}

export interface JobSearchParams {
    query?: string;
    departmentId?: string;
    designationId?: string;
    status?: string;
    employmentType?: string;
    location?: string;
    experienceLevel?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDesc?: boolean;
}
