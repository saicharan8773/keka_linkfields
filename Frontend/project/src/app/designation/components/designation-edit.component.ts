import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DesignationService } from '../../shared/services/designation.service';
import { DesignationUpdatePayload } from '../../shared/models/designation.model';

@Component({
    selector: 'app-designation-edit',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './designation-edit.component.html',
    styleUrls: ['./designation-edit.component.css']
})
export class DesignationEditComponent implements OnInit {
    designation: DesignationUpdatePayload = {
        title: ''
    };
    designationId: string = '';
    isLoading: boolean = false;
    errorMessage: string = '';

    constructor(
        private designationService: DesignationService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.designationId = this.route.snapshot.paramMap.get('id') || '';
        if (this.designationId) {
            this.loadDesignation();
        } else {
            this.router.navigate(['/designations']);
        }
    }

    loadDesignation(): void {
        this.isLoading = true;
        this.designationService.getDesignationById(this.designationId).subscribe({
            next: (data) => {
                this.designation = {
                    title: data.title
                };
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load designation details.';
                this.isLoading = false;
            }
        });
    }

    onSubmit(): void {
        if (!this.designation.title) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.designationService.updateDesignation(this.designationId, this.designation).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/designations']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'Failed to update designation. Please try again.';
            }
        });
    }
}
