export interface Department {
    id: string;
    name: string;
    code: string;
}

export interface DepartmentCreatePayload {
    name: string;
    code: string;
}

export interface DepartmentUpdatePayload {
    name?: string;
    code?: string;
}
