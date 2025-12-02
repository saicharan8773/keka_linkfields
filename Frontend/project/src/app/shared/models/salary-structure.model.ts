export interface SalaryStructure {
    id: string;
    basic: number;
    hra: number;
    otherAllowances: number;
    deductions: number;
}

export interface SalaryStructureCreatePayload {
    basic: number;
    hra: number;
    otherAllowances: number;
    deductions: number;
}

export interface SalaryStructureUpdatePayload {
    basic?: number;
    hra?: number;
    otherAllowances?: number;
    deductions?: number;
}
