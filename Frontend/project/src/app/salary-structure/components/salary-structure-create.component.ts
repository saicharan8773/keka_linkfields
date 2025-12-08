import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryStructureService } from '../../shared/services/salary-structure.service';
import { SalaryStructureCreatePayload } from '../../shared/models/salary-structure.model';

@Component({
    selector: 'app-salary-structure-create',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './salary-structure-create.component.html',
    styleUrls: ['./salary-structure-create.component.css']
})
export class SalaryStructureCreateComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() salaryStructureAdded = new EventEmitter<void>();

    salaryStructure: SalaryStructureCreatePayload = {
        title: '',
        description: '',
        basic: 0,
        hra: 0,
        otherAllowances: 0,
        deductions: 0
    };

    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(private salaryStructureService: SalaryStructureService) { }

    onCancel() {
        this.closeModal.emit();
    }

    get total(): number {
        return (this.salaryStructure.basic || 0) +
            (this.salaryStructure.hra || 0) +
            (this.salaryStructure.otherAllowances || 0) -
            (this.salaryStructure.deductions || 0);
    }

    onSubmit(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.salaryStructureService.createSalaryStructure(this.salaryStructure).subscribe({
            next: () => {
                this.isLoading = false;
                this.salaryStructureAdded.emit();
                this.closeModal.emit();
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to create salary structure. Please try again.';
            }
        });
    }
}