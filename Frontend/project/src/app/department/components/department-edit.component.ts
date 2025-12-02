import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../shared/services/department.service';
import { DepartmentUpdatePayload } from '../../shared/models/department.model';

@Component({
    selector: 'app-department-edit',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './department-edit.component.html',
    styleUrls: ['./department-edit.component.css']
})
export class DepartmentEditComponent implements OnInit {
    department: DepartmentUpdatePayload = {
        name: '',
        code: ''
    };
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
                this.department = {
                    name: data.name,
                    code: data.code
                };
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load department details.';
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (!this.department.name || !this.department.code) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.departmentService.updateDepartment(this.departmentId, this.department).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/departments']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to update department. Please try again.';
            }
        });
    }
}
