export interface SalaryStructure {
    id: string;
    title: string;
    description: string;
    basic: number;
    hra: number;
    otherAllowances: number;
    deductions: number;
}

export interface SalaryStructureCreatePayload {
    title: string;
    description: string;
    basic: number;
    hra: number;
    otherAllowances: number;
    deductions: number;
}

export interface SalaryStructureUpdatePayload {
    title?: string;
    description?: string;
    basic?: number;
    hra?: number;
    otherAllowances?: number;
    deductions?: number;
}
