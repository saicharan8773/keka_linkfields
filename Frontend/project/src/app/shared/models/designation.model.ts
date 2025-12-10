export interface Designation {
    id: string;
    title: string;
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
