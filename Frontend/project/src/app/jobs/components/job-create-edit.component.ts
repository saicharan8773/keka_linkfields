import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../shared/services/job.service';
import { DepartmentService } from '../../shared/services/department.service';
import { DesignationService } from '../../shared/services/designation.service';
import { ToastService } from '../../shared/services/toast.service';
import { Job, CreateJobRequest, UpdateJobRequest } from '../../shared/models/job.model';

@Component({
    selector: 'app-job-create-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './job-create-edit.component.html',
    styleUrl: './job-create-edit.component.css',
})
export class JobCreateEditComponent implements OnInit {
    @Input() job: Job | null = null;
    @Output() closeModal = new EventEmitter<void>();
    @Output() jobSaved = new EventEmitter<void>();

    jobForm!: FormGroup;
    isEditMode: boolean = false;
    isSaving: boolean = false;

    departments: any[] = [];
    designations: any[] = [];
    filteredDesignations: any[] = [];
    skillsInput: string = '';
    skillsList: string[] = [];

    constructor(
        private fb: FormBuilder,
        private jobService: JobService,
        private departmentService: DepartmentService,
        private designationService: DesignationService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.isEditMode = !!this.job;
        this.loadDepartments();
        this.loadDesignations();
        this.initializeForm();

        if (this.job?.skills) {
            this.skillsList = [...this.job.skills];
        }
    }

    /**
     * Load departments
     */
    loadDepartments(): void {
        this.departmentService.getAllDepartments().subscribe({
            next: (departments) => {
                this.departments = departments;
            },
            error: (error) => {
                console.error('Error loading departments:', error);
            }
        });
    }

    /**
     * Load designations
     */
    loadDesignations(): void {
        this.designationService.getAllDesignations().subscribe({
            next: (designations) => {
                this.designations = designations;
                this.filterDesignations();
            },
            error: (error) => {
                console.error('Error loading designations:', error);
            }
        });
    }

    /**
     * Filter designations by department
     */
    filterDesignations(): void {
        const departmentId = this.jobForm?.get('departmentId')?.value;
        if (departmentId) {
            this.filteredDesignations = this.designations.filter(
                d => d.departmentId === departmentId
            );
        } else {
            this.filteredDesignations = this.designations;
        }
    }

    /**
     * Initialize form with validation
     */
    initializeForm(): void {
        this.jobForm = this.fb.group({
            title: [
                this.job?.title || '',
                [Validators.required, Validators.maxLength(200)]
            ],
            jobCode: [this.job?.jobCode || ''],
            departmentId: [this.job?.departmentId || ''],
            designationId: [this.job?.designationId || ''],
            employmentType: [this.job?.employmentType || 'FullTime', Validators.required],
            experienceLevel: [this.job?.experienceLevel || 'Fresher', Validators.required],
            location: [this.job?.location || 'Onsite', Validators.required],
            salaryMin: [this.job?.salaryMin || null, [Validators.min(0)]],
            salaryMax: [this.job?.salaryMax || null, [Validators.min(0)]],
            openings: [this.job?.openings || 1, [Validators.required, Validators.min(1)]],
            description: [
                this.job?.description || '',
                [Validators.required, Validators.maxLength(5000)]
            ],
            status: [this.job?.status || 'Draft', Validators.required],
        });

        // Watch for department changes
        this.jobForm.get('departmentId')?.valueChanges.subscribe(() => {
            this.filterDesignations();
            this.jobForm.get('designationId')?.setValue('');
        });
    }

    /**
     * Get form control for validation
     */
    get f() {
        return this.jobForm.controls;
    }

    /**
     * Add skill
     */
    addSkill(): void {
        const skill = this.skillsInput.trim();
        if (skill && !this.skillsList.includes(skill)) {
            this.skillsList.push(skill);
            this.skillsInput = '';
        }
    }

    /**
     * Remove skill
     */
    removeSkill(skill: string): void {
        this.skillsList = this.skillsList.filter(s => s !== skill);
    }

    /**
     * Submit form
     */
    onSubmit(): void {
        if (this.jobForm.invalid) {
            this.jobForm.markAllAsTouched();
            return;
        }

        // Validate salary range
        const salaryMin = this.jobForm.value.salaryMin;
        const salaryMax = this.jobForm.value.salaryMax;
        if (salaryMin && salaryMax && salaryMin > salaryMax) {
            this.toastService.error('Minimum salary cannot be greater than maximum salary');
            return;
        }

        this.isSaving = true;

        if (this.isEditMode && this.job) {
            this.updateJob();
        } else {
            this.createJob();
        }
    }

    /**
     * Create new job
     */
    createJob(): void {
        const payload: CreateJobRequest = {
            title: this.jobForm.value.title.trim(),
            jobCode: this.jobForm.value.jobCode?.trim() || undefined,
            departmentId: this.jobForm.value.departmentId || undefined,
            designationId: this.jobForm.value.designationId || undefined,
            employmentType: this.jobForm.value.employmentType,
            experienceLevel: this.jobForm.value.experienceLevel,
            location: this.jobForm.value.location,
            salaryMin: this.jobForm.value.salaryMin || undefined,
            salaryMax: this.jobForm.value.salaryMax || undefined,
            openings: this.jobForm.value.openings,
            description: this.jobForm.value.description.trim(),
            skills: this.skillsList.length > 0 ? this.skillsList : undefined,
            status: this.jobForm.value.status,
        };

        this.jobService.createJob(payload).subscribe({
            next: () => {
                this.isSaving = false;
                this.jobSaved.emit();
            },
            error: (error) => {
                console.error('Error creating job:', error);
                this.toastService.error(
                    error.error?.message || 'Failed to create job'
                );
                this.isSaving = false;
            },
        });
    }

    /**
     * Update existing job
     */
    updateJob(): void {
        const payload: UpdateJobRequest = {
            title: this.jobForm.value.title.trim(),
            jobCode: this.jobForm.value.jobCode.trim(),
            departmentId: this.jobForm.value.departmentId || undefined,
            designationId: this.jobForm.value.designationId || undefined,
            employmentType: this.jobForm.value.employmentType,
            experienceLevel: this.jobForm.value.experienceLevel,
            location: this.jobForm.value.location,
            salaryMin: this.jobForm.value.salaryMin || undefined,
            salaryMax: this.jobForm.value.salaryMax || undefined,
            openings: this.jobForm.value.openings,
            description: this.jobForm.value.description.trim(),
            skills: this.skillsList.length > 0 ? this.skillsList : undefined,
            status: this.jobForm.value.status,
        };

        this.jobService.updateJob(this.job!.id, payload).subscribe({
            next: () => {
                this.isSaving = false;
                this.jobSaved.emit();
            },
            error: (error) => {
                console.error('Error updating job:', error);
                this.toastService.error(
                    error.error?.message || 'Failed to update job'
                );
                this.isSaving = false;
            },
        });
    }

    /**
     * Close modal
     */
    onClose(): void {
        this.closeModal.emit();
    }
}
