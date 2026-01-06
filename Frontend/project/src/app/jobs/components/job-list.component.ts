import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../shared/services/job.service';
import { ToastService } from '../../shared/services/toast.service';
import { Job } from '../../shared/models/job.model';
import { SidebarComponent } from '../../shared/components/sidebar.component';
import { ToastComponent } from '../../shared/components/toast.component';
import { JobCreateEditComponent } from './job-create-edit.component';
import { JobDetailsComponent } from './job-details.component';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal.component';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SidebarComponent,
        ToastComponent,
        JobCreateEditComponent,
        JobDetailsComponent,
        DeleteConfirmationModalComponent
    ],
    templateUrl: './job-list.component.html',
    styleUrl: './job-list.component.css',
})
export class JobListComponent implements OnInit {
    jobs: Job[] = [];
    searchText: string = '';
    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 1;
    totalJobs: number = 0;

    // Filters
    selectedStatus: string = '';
    selectedLocation: string = '';
    selectedEmploymentType: string = '';

    // Modal states
    showCreateModal: boolean = false;
    showEditModal: boolean = false;
    showDetailsModal: boolean = false;
    showDeleteModal: boolean = false;
    showCloseModal: boolean = false;

    selectedJobId: string = '';
    selectedJob: Job | null = null;
    jobToDelete: string = '';
    jobToClose: string = '';
    isDeleting: boolean = false;
    isClosing: boolean = false;

    // Loading state
    isLoading: boolean = false;

    constructor(
        private jobService: JobService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadJobs();
    }

    /**
     * Load jobs from API
     */
    loadJobs(): void {
        this.isLoading = true;
        const filters = {
            query: this.searchText,
            status: this.selectedStatus,
            location: this.selectedLocation,
            employmentType: this.selectedEmploymentType,
            page: this.currentPage,
            pageSize: this.pageSize,
        };

        this.jobService.getAllJobs(filters).subscribe({
            next: (response) => {
                this.jobs = response.items;
                this.totalJobs = response.total;
                this.calculateTotalPages();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading jobs:', error);
                this.toastService.error('Failed to load jobs');
                this.isLoading = false;
            },
        });
    }

    /**
     * Search jobs
     */
    onSearch(): void {
        this.currentPage = 1;
        this.loadJobs();
    }

    /**
     * Filter change handler
     */
    onFilterChange(): void {
        this.currentPage = 1;
        this.loadJobs();
    }

    /**
     * Calculate total pages for pagination
     */
    calculateTotalPages(): void {
        this.totalPages = Math.max(1, Math.ceil(this.totalJobs / this.pageSize));
    }

    /**
     * Get serial number for table row
     */
    getSerialNumber(index: number): number {
        return (this.currentPage - 1) * this.pageSize + index + 1;
    }

    /**
     * Handle page change
     */
    onPageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadJobs();
        }
    }

    /**
     * Open create job modal
     */
    openCreateModal(): void {
        this.selectedJob = null;
        this.showCreateModal = true;
    }

    /**
     * Open edit job modal
     */
    openEditModal(job: Job): void {
        this.selectedJob = job;
        this.selectedJobId = job.id;
        this.showEditModal = true;
    }

    /**
     * Open job details modal
     */
    openDetailsModal(jobId: string): void {
        this.selectedJobId = jobId;
        this.showDetailsModal = true;
    }

    /**
     * Handle job created
     */
    onJobCreated(): void {
        this.showCreateModal = false;
        this.loadJobs();
        this.toastService.success('Job created successfully');
    }

    /**
     * Handle job updated
     */
    onJobUpdated(): void {
        this.showEditModal = false;
        this.loadJobs();
        this.toastService.success('Job updated successfully');
    }

    /**
     * Open delete confirmation modal
     */
    onDelete(jobId: string): void {
        this.jobToDelete = jobId;
        this.showDeleteModal = true;
    }

    /**
     * Confirm delete job
     */
    confirmDelete(): void {
        this.isDeleting = true;
        this.jobService.deleteJob(this.jobToDelete).subscribe({
            next: () => {
                this.toastService.success('Job deleted successfully');
                this.showDeleteModal = false;
                this.isDeleting = false;
                this.loadJobs();
            },
            error: (error) => {
                console.error('Error deleting job:', error);
                const errorMessage = error.error?.message ||
                    error.error?.title ||
                    'Failed to delete job.';
                this.toastService.error(errorMessage);
                this.isDeleting = false;
            },
        });
    }

    /**
     * Cancel delete
     */
    cancelDelete(): void {
        this.showDeleteModal = false;
        this.jobToDelete = '';
    }

    /**
     * Open close job confirmation modal
     */
    onCloseJob(jobId: string): void {
        this.jobToClose = jobId;
        this.showCloseModal = true;
    }

    /**
     * Confirm close job
     */
    confirmCloseJob(): void {
        this.isClosing = true;
        this.jobService.closeJob(this.jobToClose).subscribe({
            next: () => {
                this.toastService.success('Job closed successfully');
                this.showCloseModal = false;
                this.isClosing = false;
                this.loadJobs();
            },
            error: (error) => {
                console.error('Error closing job:', error);
                const errorMessage = error.error?.message ||
                    error.error?.title ||
                    'Failed to close job.';
                this.toastService.error(errorMessage);
                this.isClosing = false;
            },
        });
    }

    /**
     * Cancel close job
     */
    cancelCloseJob(): void {
        this.showCloseModal = false;
        this.jobToClose = '';
    }

    /**
     * Close modals
     */
    closeCreateModal(): void {
        this.showCreateModal = false;
    }

    closeEditModal(): void {
        this.showEditModal = false;
    }

    closeDetailsModal(): void {
        this.showDetailsModal = false;
    }

    /**
     * Get status badge class
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
