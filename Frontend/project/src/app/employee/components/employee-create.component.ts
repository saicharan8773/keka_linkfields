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
    displayName: "",
    workEmail: "",
    mobileNumber: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    joiningDate: "",
    role:"",
    designationId: "",
    departmentId: "",
    managerId: "",
    locationId: "",
    employmentType: "",
    timeType: "",
    salaryStructureId: "",
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
    this.employee.designationId = "";
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

    this.employeeService.createEmployee(this.employee).subscribe({
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
