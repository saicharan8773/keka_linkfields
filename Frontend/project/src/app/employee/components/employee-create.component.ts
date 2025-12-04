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
    designationId: "",
    departmentId: "",
    managerId: "",
    locationId: "",
    employmentType: "",
    timeType: "",
  };

  onCancel() {
    this.closeModal.emit();
    this.errorMessage = null;
  }

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private master: DropdownService
  ) {}

  ngOnInit() {
    this.loadMasters();
  }
  loadMasters() {
    this.master.getDepartments().subscribe((res) => (this.departments = res));
    this.master.getDesignations().subscribe((res) => (this.designations = res));
    this.master.getLocations().subscribe((res) => (this.locations = res));
    this.master.getManagers().subscribe((res) => (this.users = res));
  }
  onSubmit() {
    this.isLoading = true;
    this.errorMessage = null;

    // Validate Required Fields (Basic Check)
    if (
      !this.employee.employeeCode ||
      !this.employee.firstName ||
      !this.employee.lastName ||
      !this.employee.workEmail
    ) {
      this.errorMessage = "Please fill in all required fields (*).";
      this.isLoading = false;
      return;
    }
    console.log("Submitting Payload:", this.employee);

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
