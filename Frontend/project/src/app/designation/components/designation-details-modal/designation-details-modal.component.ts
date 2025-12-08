import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignationService } from '../../../shared/services/designation.service';
import { Designation } from '../../../shared/models/designation.model';

@Component({
  selector: 'app-designation-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './designation-details-modal.component.html',
  styleUrls: ['./designation-details-modal.component.css']
})
export class DesignationDetailsModalComponent implements OnChanges {
  @Input() designationId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() editDesignation = new EventEmitter<string>();

  designation: Designation | null = null;
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
        this.designation = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load designation details.';
        this.isLoading = false;
      }
    });
  }

  onEdit(): void {
    this.editDesignation.emit(this.designationId);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
