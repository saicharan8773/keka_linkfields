import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../shared/services/leave.service';
import { AuthService } from '../../../shared/services/auth.service';
import { LeaveType } from '../../../shared/models/leave.model';

@Component({
    selector: 'app-leave-request-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [DatePipe],
    templateUrl: './leave-request-modal.component.html',
    styleUrls: ['./leave-request-modal.component.css']
})
export class LeaveRequestModalComponent implements OnInit {
    @Output() submitted = new EventEmitter<void>();

    isOpen = false;
    leaveTypes: LeaveType[] = [];

    // Form Model
    leaveTypeId: number | null = null;
    startDate: string = '';
    endDate: string = '';
    reason: string = '';

    // Computed / UI
    totalDays: number = 0;
    errorMessage: string = '';
    isSubmitting = false;

    constructor(
        private leaveService: LeaveService,
        private authService: AuthService,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.loadLeaveTypes();
    }

    loadLeaveTypes() {
        this.leaveService.getLeaveTypes().subscribe({
            next: (types) => this.leaveTypes = types,
            error: (err) => console.error('Error loading leave types', err)
        });
    }

    open() {
        this.isOpen = true;
        this.resetForm();
    }

    close() {
        this.isOpen = false;
    }

    resetForm() {
        this.leaveTypeId = null;
        this.startDate = '';
        this.endDate = '';
        this.reason = '';
        this.totalDays = 0;
        this.errorMessage = '';
    }

    calculateDays() {
        if (this.startDate && this.endDate) {
            const start = new Date(this.startDate);
            const end = new Date(this.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            if (end.getTime() < start.getTime()) {
                this.totalDays = 0;
                return;
            }

            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            this.totalDays = diffDays;
        } else {
            this.totalDays = 0;
        }
    }

    submit() {
        this.errorMessage = '';

        if (!this.leaveTypeId || !this.startDate || !this.endDate) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }

        if (this.totalDays <= 0) {
            this.errorMessage = 'End date must be after start date.';
            return;
        }

        const employeeId = this.authService.getEmployeeId();
        if (!employeeId) {
            this.errorMessage = 'Session expired. Please login again.';
            return;
        }

        this.isSubmitting = true;

        const payload = {
            employeeId: employeeId,
            leaveTypeId: this.leaveTypeId,
            startDate: this.datePipe.transform(this.startDate, 'yyyy-MM-dd')!,
            endDate: this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!,
            reason: this.reason || ''
        };

        this.leaveService.applyLeave(payload).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.close();
                this.submitted.emit();
            },
            error: (err) => {
                this.isSubmitting = false;
                this.errorMessage = err.error?.message || 'Failed to submit request.';
            }
        });
    }
}