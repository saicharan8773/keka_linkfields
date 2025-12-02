import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SalaryStructureService } from '../../shared/services/salary-structure.service';
import { SalaryStructure } from '../../shared/models/salary-structure.model';

@Component({
    selector: 'app-salary-structure-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './salary-structure-details.component.html',
    styleUrls: ['./salary-structure-details.component.css']
})
export class SalaryStructureDetailsComponent implements OnInit {
    salaryStructure: SalaryStructure | null = null;
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
                this.salaryStructure = data;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load salary structure details.';
                this.isLoading = false;
            }
        });
    }

    get total(): number {
        if (!this.salaryStructure) return 0;
        return (this.salaryStructure.basic || 0) +
            (this.salaryStructure.hra || 0) +
            (this.salaryStructure.otherAllowances || 0) -
            (this.salaryStructure.deductions || 0);
    }

    onDelete(): void {
        if (!this.salaryStructureId) return;

        if (confirm('Are you sure you want to delete this salary structure?')) {
            this.salaryStructureService.deleteSalaryStructure(this.salaryStructureId).subscribe({
                next: () => {
                    this.router.navigate(['/salary-structures']);
                },
                error: (error) => {
                    alert('Failed to delete salary structure. Please try again.');
                }
            });
        }
    }
}
