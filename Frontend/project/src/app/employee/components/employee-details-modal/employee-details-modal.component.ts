import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmployeeService } from "../../../shared/services/employee.service";
import { Employee } from "../../../shared/models/employee.model";

@Component({
  selector: "app-employee-details-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./employee-details-modal.component.html",
  styleUrls: ["./employee-details-modal.component.css"],
})
export class EmployeeDetailsModalComponent implements OnInit { 
  @Input() employeeId: string = "";
  @Output() closeModal = new EventEmitter<void>();
  @Output() editEmployee = new EventEmitter<string>();

  employee: Employee | null = null;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    if (this.employeeId) {
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (data) => {
        this.employee = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load employee details.";
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.closeModal.emit();
  }

  onEdit(): void {
    if (this.employee?.id) {
      this.editEmployee.emit(this.employee.id);
    }
  }
}
