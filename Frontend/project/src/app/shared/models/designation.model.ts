export interface Designation {
  description: string;
  id: string;
  title: string;
  departmentId?: string;
  departmentName?: string;
  departmentCode?: string;
}

export interface DesignationCreatePayload {
  departmentId: string;
  title: string;
  description: string;
}

export interface DesignationUpdatePayload {
    title?: string;
    description?: string;
    departmentId?: string;
}
