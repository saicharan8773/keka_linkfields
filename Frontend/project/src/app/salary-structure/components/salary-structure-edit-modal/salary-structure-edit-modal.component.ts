import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryStructureService } from '../../../shared/services/salary-structure.service';
import { SalaryStructureUpdatePayload } from '../../../shared/models/salary-structure.model';

@Component({
  selector: 'app-salary-structure-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-structure-edit-modal.component.html',
  styleUrls: ['./salary-structure-edit-modal.component.css']
})
export class SalaryStructureEditModalComponent implements OnChanges {
  @Input() salaryStructureId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() salaryStructureUpdated = new EventEmitter<void>();

  salaryStructure: SalaryStructureUpdatePayload = {
    title: '',
    description: '',
    basic: 0,
    hra: 0,
    otherAllowances: 0,
    deductions: 0
  };
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private salaryStructureService: SalaryStructureService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['salaryStructureId'] && this.salaryStructureId) {
      this.loadSalaryStructure();
    }
  }

  loadSalaryStructure(): void {
    this.isLoading = true;
    this.salaryStructureService.getSalaryStructureById(this.salaryStructureId).subscribe({
      next: (data) => {
        this.salaryStructure = {
          title: data.title,
          description: data.description,
          basic: data.basic,
          hra: data.hra,
          otherAllowances: data.otherAllowances,
          deductions: data.deductions
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load salary structure details.';
        this.isLoading = false;
      }
    });
  }

  get total(): number {
    return (this.salaryStructure.basic || 0) +
           (this.salaryStructure.hra || 0) +
           (this.salaryStructure.otherAllowances || 0) -
           (this.salaryStructure.deductions || 0);
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.salaryStructureService.updateSalaryStructure(this.salaryStructureId, this.salaryStructure).subscribe({
      next: () => {
        this.isLoading = false;
        this.salaryStructureUpdated.emit();
        this.onClose();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to update salary structure. Please try again.';
      }
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
