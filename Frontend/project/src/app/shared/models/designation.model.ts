export interface Designation {
    id: string;
    title: string;
}

export interface DesignationCreatePayload {
    title: string;
}

export interface DesignationUpdatePayload {
    title?: string;
}
