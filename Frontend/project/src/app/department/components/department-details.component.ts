import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepartmentService } from '../../shared/services/department.service';
import { Department } from '../../shared/models/department.model';

@Component({
    selector: 'app-department-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './department-details.component.html',
    styleUrls: ['./department-details.component.css']
})
export class DepartmentDetailsComponent implements OnInit {
    department: Department | null = null;
    departmentId: string = '';
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.departmentId = this.route.snapshot.paramMap.get('id') || '';
        if (this.departmentId) {
            this.loadDepartment();
        } else {
            this.router.navigate(['/departments']);
        }
    }

    loadDepartment(): void {
        this.isLoading = true;
        this.departmentService.getDepartmentById(this.departmentId).subscribe({
            next: (data) => {
                this.department = data;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load department details.';
                this.isLoading = false;
            }
        });
    }

    onDelete(): void {
        if (!this.departmentId) return;

        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.deleteDepartment(this.departmentId).subscribe({
                next: () => {
                    this.router.navigate(['/departments']);
                },
                error: (error) => {
                    alert('Failed to delete department. Please try again.');
                }
            });
        }
    }
}
