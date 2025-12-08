import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryStructureService } from '../../../shared/services/salary-structure.service';
import { SalaryStructure } from '../../../shared/models/salary-structure.model';

@Component({
  selector: 'app-salary-structure-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salary-structure-details-modal.component.html',
  styleUrls: ['./salary-structure-details-modal.component.css']
})
export class SalaryStructureDetailsModalComponent implements OnChanges {
  @Input() salaryStructureId: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() editSalaryStructure = new EventEmitter<string>();

  salaryStructure: SalaryStructure | null = null;
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
        this.salaryStructure = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load salary structure details.';
        this.isLoading = false;
      }
    });
  }

  get total(): number {
    if (!this.salaryStructure) return 0;
    return (this.salaryStructure.basic || 0) +
           (this.salaryStructure.hra || 0) +
           (this.salaryStructure.otherAllowances || 0) -
           (this.salaryStructure.deductions || 0);
  }

  onEdit(): void {
    this.editSalaryStructure.emit(this.salaryStructureId);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
