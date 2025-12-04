import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalaryStructureService } from '../../shared/services/salary-structure.service';
import { SalaryStructureCreatePayload } from '../../shared/models/salary-structure.model';

@Component({
    selector: 'app-salary-structure-create',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './salary-structure-create.component.html',
    styleUrls: ['./salary-structure-create.component.css']
})
export class SalaryStructureCreateComponent {
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

    constructor(
        private salaryStructureService: SalaryStructureService,
        private router: Router
    ) { }

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
                this.router.navigate(['/salary-structures']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to create salary structure. Please try again.';
            }
        });
    }
}
