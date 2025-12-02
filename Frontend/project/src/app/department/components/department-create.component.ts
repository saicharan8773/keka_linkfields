import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../shared/services/department.service';
import { DepartmentCreatePayload } from '../../shared/models/department.model';

@Component({
    selector: 'app-department-create',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './department-create.component.html',
    styleUrls: ['./department-create.component.css']
})
export class DepartmentCreateComponent {
    department: DepartmentCreatePayload = {
        name: '',
        code: ''
    };

    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private departmentService: DepartmentService,
        private router: Router
    ) { }

    onSubmit(): void {
        if (!this.department.name || !this.department.code) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.departmentService.createDepartment(this.department).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/departments']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to create department. Please try again.';
            }
        });
    }
}
