export interface CreateRequest {
    leaveType: string;
    startDate: string;
    endDate: string; reason: string;
    managerId: string;
    isHalfDay: boolean;
    attachmentUrl?: string[];
}