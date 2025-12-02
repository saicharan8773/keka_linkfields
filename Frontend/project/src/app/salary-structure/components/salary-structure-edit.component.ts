import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalaryStructureService } from '../../shared/services/salary-structure.service';
import { SalaryStructureUpdatePayload } from '../../shared/models/salary-structure.model';

@Component({
    selector: 'app-salary-structure-edit',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './salary-structure-edit.component.html',
    styleUrls: ['./salary-structure-edit.component.css']
})
export class SalaryStructureEditComponent implements OnInit {
    salaryStructure: SalaryStructureUpdatePayload = {
        basic: 0,
        hra: 0,
        otherAllowances: 0,
        deductions: 0
    };
    salaryStructureId: string = '';
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private salaryStructureService: SalaryStructureService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.salaryStructureId = this.route.snapshot.paramMap.get('id') || '';
        if (this.salaryStructureId) {
            this.loadSalaryStructure();
        } else {
            this.router.navigate(['/salary-structures']);
        }
    }

    loadSalaryStructure(): void {
        this.isLoading = true;
        this.salaryStructureService.getSalaryStructureById(this.salaryStructureId).subscribe({
            next: (data) => {
                this.salaryStructure = {
                    basic: data.basic,
                    hra: data.hra,
                    otherAllowances: data.otherAllowances,
                    deductions: data.deductions
                };
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load salary structure details.';
                this.isLoading = false;
            }
        });
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

        this.salaryStructureService.updateSalaryStructure(this.salaryStructureId, this.salaryStructure).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/salary-structures']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to update salary structure. Please try again.';
            }
        });
    }
}
