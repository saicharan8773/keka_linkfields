import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesignationService } from '../../shared/services/designation.service';
import { DesignationCreatePayload } from '../../shared/models/designation.model';

@Component({
    selector: 'app-designation-create',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './designation-create.component.html',
    styleUrls: ['./designation-create.component.css']
})
export class DesignationCreateComponent {
    designation: DesignationCreatePayload = {
        title: ''
    };

    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private designationService: DesignationService,
        private router: Router
    ) { }

    onSubmit(): void {
        if (!this.designation.title) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.designationService.createDesignation(this.designation).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/designations']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to create designation. Please try again.';
            }
        });
    }
}
