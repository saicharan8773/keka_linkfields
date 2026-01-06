import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../shared/services/job.service';
import { ToastService } from '../../shared/services/toast.service';
import { Job } from '../../shared/models/job.model';

@Component({
    selector: 'app-job-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './job-details.component.html',
    styleUrl: './job-details.component.css',
})
export class JobDetailsComponent implements OnInit {
    @Input() jobId: string = '';
    @Output() closeModal = new EventEmitter<void>();
    @Output() editJob = new EventEmitter<Job>();

    job: Job | null = null;
    isLoading: boolean = false;

    constructor(
        private jobService: JobService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadJobDetails();
    }

    /**
     * Load job details
     */
    loadJobDetails(): void {
        this.isLoading = true;
        this.jobService.getJobById(this.jobId).subscribe({
            next: (job) => {
                this.job = job;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading job details:', error);
                this.toastService.error('Failed to load job details');
                this.isLoading = false;
            },
        });
    }

    /**
     * Edit job
     */
    onEdit(): void {
        if (this.job) {
            this.editJob.emit(this.job);
            this.closeModal.emit();
        }
    }

    /**
     * Close modal
     */
    onClose(): void {
        this.closeModal.emit();
    }

    /**
     * Get status class
     */
    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'active':
                return 'status-active';
            case 'draft':
                return 'status-draft';
            case 'closed':
                return 'status-closed';
            default:
                return '';
        }
    }
}
