import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EmployeeService } from "../../../shared/services/employee.service";
import {
  Employee,
  EmployeeUpdatePayload,
} from "../../../shared/models/employee.model";
import { Department } from "../../../shared/models/department.model";
import { Designation } from "../../../shared/models/designation.model";
import { DepartmentService } from "../../../shared/services/department.service";
import { DesignationService } from "../../../shared/services/designation.service";

@Component({
  selector: "app-employee-edit-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./employee-edit-modal.component.html",
  styleUrls: ["./employee-edit-modal.component.css"],
})
export class EmployeeEditModalComponent implements OnInit {
  @Input() employeeId: string = "";
  @Output() closeModal = new EventEmitter<void>();
  @Output() employeeUpdated = new EventEmitter<void>();

  employee: Employee | null = null;
  isLoading: boolean = false;
  errorMessage: string = "";
  departments: Department[] = [];
  designations: Designation[] = [];
  managers: Employee[] = [];
  locations: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private designationService: DesignationService
  ) {}

  ngOnInit(): void {
    if (this.employeeId) {
      this.loadEmployee();
      this.loadDepartments();
      this.loadDesignations();
      this.loadLocations();
      this.loadManagers();
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

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  loadDesignations(): void {
    this.designationService.getAllDesignations().subscribe((data) => {
      this.designations = data;
    });
  }

  loadManagers(): void {
    this.employeeService.getAllEmployees().subscribe((data) => {
      this.managers = data;
    });
  }
  loadLocations(): void {
    this.locations = [
      { id: "1", name: "Head Office" },
      { id: "2", name: "Branch Office" },
    ];
  }

  onSubmit(): void {
    if (!this.employee) return;

    this.isLoading = true;
    this.errorMessage = "";

    const updatePayload: EmployeeUpdatePayload = {
      ...this.employee,
    };

    this.employeeService
      .updateEmployee(this.employeeId, updatePayload)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.employeeUpdated.emit();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            "Failed to update employee. Please try again.";
        },
      });
  }

  onCancel(): void {
    this.closeModal.emit();
  }
}
