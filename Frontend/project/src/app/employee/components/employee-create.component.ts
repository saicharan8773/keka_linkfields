import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { EmployeeCreatePayload } from "../../shared/models/employee.model";
import { EmployeeService } from "../../shared/services/employee.service";
import { DropdownService } from "../../shared/services/dropdown.service";

@Component({
  selector: "app-employee-create",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./employee-create.component.html",
  styleUrls: ["./employee-create.component.css"],
})
export class EmployeeCreateComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() employeeAdded = new EventEmitter<void>();

  designations: any[] = [];
  departments: any[] = [];
  locations: any[] = [];
  users: any[] = [];
  salaries: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  // Initialize the model with default values
  employee: EmployeeCreatePayload = {
    employeeCode: "",
    firstName: "",
    lastName: "",
    displayName: null,
    workEmail: "",
    mobileNumber: null,
    dateOfBirth: null,
    gender: null,
    nationality: null,
    joiningDate: "",
    role: "",
    designationId: null,
    departmentId: null,
    managerId: null,
    locationId: null,
    employmentType: null,
    timeType: null,
    salaryStructureId: null,
  };

  onCancel() {
    this.closeModal.emit();
    this.errorMessage = null;
  }

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private master: DropdownService
  ) {
  }

  ngOnInit() {
    this.loadMasters();
  }
  loadMasters() {
    this.master.getDepartments().subscribe((res) => (this.departments = res));
    // Don't load all designations on init - they will be loaded based on selected department
    this.master.getLocations().subscribe((res) => (this.locations = res));
    this.master.getManagers().subscribe((res) => (this.users = res));
    this.master.getSalaries().subscribe((res) => (this.salaries = res));
  }

  onDepartmentChange() {
    // Reset designation field when department changes
    this.employee.designationId = null;
    this.designations = [];

    // Load designations for the selected department
    if (this.employee.departmentId) {
      this.master.getDesignationsByDepartment(this.employee.departmentId).subscribe({
        next: (res) => {
          this.designations = res;
        },
        error: (err) => {
          console.error("Failed to load designations for department", err);
          this.designations = [];
        }
      });
    }
  }
  onSubmit() {
    this.isLoading = true;
    this.errorMessage = null;

    // Validate Required Fields (Basic Check)
    if (
      !this.employee.employeeCode ||
      !this.employee.firstName ||
      !this.employee.lastName ||
      !this.employee.workEmail ||
      !this.employee.role
    ) {
      this.errorMessage = "Please fill in all required fields (*).";
      this.isLoading = false;
      return;
    };

    // Convert empty strings to null for optional fields
    const payload = {
      ...this.employee,
      displayName: this.employee.displayName || null,
      mobileNumber: this.employee.mobileNumber || null,
      dateOfBirth: this.employee.dateOfBirth || null,
      gender: this.employee.gender || null,
      nationality: this.employee.nationality || null,
      designationId: this.employee.designationId || null,
      departmentId: this.employee.departmentId || null,
      managerId: this.employee.managerId || null,
      locationId: this.employee.locationId || null,
      employmentType: this.employee.employmentType || null,
      timeType: this.employee.timeType || null,
      salaryStructureId: this.employee.salaryStructureId || null,
    };

    this.employeeService.createEmployee(payload).subscribe({
      next: (res: any) => {
        if (res && res.message === "Employee created successfully") {
          this.isLoading = false;
          this.employeeAdded.emit();
        }
      },
      error: (err) => {
        console.error("Create employee failed", err);
        this.errorMessage = "Failed to create employee. Please try again.";
        this.isLoading = false;
      },
    });
  }
}
