export interface Designation {
    id: string;
    title: string;
    description?: string;
    departmentId?: string;
    departmentName?: string;
    departmentCode?: string;
}

export interface DesignationCreatePayload {
    departmentId: string;
    title: string;
}

export interface DesignationUpdatePayload {
    title?: string;
}
