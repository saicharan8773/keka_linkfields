export interface Team {
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    employeeCount?: number;
    employees?: TeamEmployee[];
}

export interface TeamEmployee {
    id: string;
    employeeCode: string;
    displayName: string;
    workEmail: string;
    departmentName?: string | null;
    designationTitle?: string | null;
}

export interface TeamCreatePayload {
    name: string;
    description?: string | null;
}

export interface TeamUpdatePayload {
    name?: string | null;
    description?: string | null;
}

export interface AssignEmployeeToTeamPayload {
    teamId: string;
}

export interface TeamListResponse {
    items: Team[];
    totalCount: number;
    page: number;
    pageSize: number;
}
