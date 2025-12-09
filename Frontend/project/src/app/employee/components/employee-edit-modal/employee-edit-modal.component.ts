import { DropdownService } from './../../../shared/services/dropdown.service';
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
    private designationService: DesignationService,
    private dropdownService: DropdownService
  ) { }

  ngOnInit(): void {
    if (this.employeeId) {
      this.loadEmployee();
      this.loadDepartments();
      // Don't load all designations on init - they will be loaded based on department
      this.loadLocations();
      this.loadManagers();
    }
  }

  loadEmployee(): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (data) => {
        this.employee = data;
        // Load designations for the employee's current department
        if (this.employee.departmentId) {
          this.loadDesignationsByDepartment(this.employee.departmentId);
        }
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

  loadDesignationsByDepartment(departmentId: string): void {
    this.designationService.getDesignationsByDepartment(departmentId).subscribe({
      next: (data) => {
        this.designations = data;
      },
      error: (error) => {
        console.error("Failed to load designations for department", error);
        this.designations = [];
      }
    });
  }

  onDepartmentChange(): void {
    if (!this.employee) return;

    // Reset designation field when department changes
    this.employee.designationId = "";
    this.designations = [];

    // Load designations for the selected department
    if (this.employee.departmentId) {
      this.loadDesignationsByDepartment(this.employee.departmentId);
    }
  }

  loadManagers(): void {
    this.dropdownService.getManagers().subscribe((data) => {
      this.managers = data;
    });
  }
  loadLocations(): void {
    this.dropdownService.getLocations().subscribe((data) => {
      this.locations = data;
    });
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
