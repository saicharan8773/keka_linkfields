import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesignationService } from '../../../shared/services/designation.service';
import { DesignationUpdatePayload } from '../../../shared/models/designation.model';

@Component({
  selector: 'app-designation-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designation-edit-modal.component.html',
  styleUrls: ['./designation-edit-modal.component.css']
})
export class DesignationEditModalComponent implements OnChanges {
  @Input() designationId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() designationUpdated = new EventEmitter<void>();

  designation: DesignationUpdatePayload = {
    title: ''
  };
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private designationService: DesignationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['designationId'] && this.designationId) {
      this.loadDesignation();
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
        this.designationUpdated.emit();
        this.onClose();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update designation. Please try again.';
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
