import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../shared/services/department.service';
import { DepartmentUpdatePayload } from '../../../shared/models/department.model';

@Component({
  selector: 'app-department-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-edit-modal.component.html',
  styleUrls: ['./department-edit-modal.component.css']
})
export class DepartmentEditModalComponent implements OnChanges {
  @Input() departmentId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() departmentUpdated = new EventEmitter<void>();

  department: DepartmentUpdatePayload = {
    name: '',
    code: ''
  };
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private departmentService: DepartmentService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentId'] && this.departmentId) {
      this.loadDepartment();
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
        this.departmentUpdated.emit();
        this.onClose();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update department. Please try again.';
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
