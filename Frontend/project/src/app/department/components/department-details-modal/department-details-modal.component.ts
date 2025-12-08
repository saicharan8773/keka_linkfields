import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../shared/services/department.service';
import { Department } from '../../../shared/models/department.model';

@Component({
  selector: 'app-department-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-details-modal.component.html',
  styleUrls: ['./department-details-modal.component.css']
})
export class DepartmentDetailsModalComponent implements OnChanges {
  @Input() departmentId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() editDepartment = new EventEmitter<string>();

  department: Department | null = null;
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
        this.department = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load department details.';
        this.isLoading = false;
      }
    });
  }

  onEdit(): void {
    this.editDepartment.emit(this.departmentId);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
