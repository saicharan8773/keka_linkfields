import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DesignationService } from '../../shared/services/designation.service';
import { Designation } from '../../shared/models/designation.model';

@Component({
    selector: 'app-designation-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './designation-details.component.html',
    styleUrls: ['./designation-details.component.css']
})
export class DesignationDetailsComponent implements OnInit {
    designation: Designation | null = null;
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
                this.designation = data;
                this.isLoading = false;
            },
            error: (error) => {
                this.errorMessage = 'Failed to load designation details.';
                this.isLoading = false;
            }
        });
    }

    onDelete(): void {
        if (!this.designationId) return;

        if (confirm('Are you sure you want to delete this designation?')) {
            this.designationService.deleteDesignation(this.designationId).subscribe({
                next: () => {
                    this.router.navigate(['/designations']);
                },
                error: (error) => {
                    alert('Failed to delete designation. Please try again.');
                }
            });
        }
    }
}
