import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { EmployeeService } from "../../shared/services/employee.service";
import {
  Employee,
  EmployeeUpdatePayload,
} from "../../shared/models/employee.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";

@Component({
  selector: "app-employee-edit",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./employee-edit-modal/employee-edit-modal.component.html",
  styleUrls: [],
})
export class EmployeeEditComponent implements OnInit {
  employee: Partial<Employee> = {
    id: "",
    employeeCode: "",
    firstName: "",
    middleName: "",
    lastName: "",
    displayName: "",
    workEmail: "",
    personalEmail: "",
    mobileNumber: "",
    workNumber: "",
    residenceNumber: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    isPhysicallyHandicapped: false,
    nationality: "",
    joiningDate: "",
    designationId: "",
    designation: null,
    departmentId: "",
    department: null,
    departmentPath: "",
    managerId: "",
    manager: null,
    locationId: "",
    location: null,
    jobTitlePrimary: "",
    jobTitleSecondary: "",
    isInProbation: false,
    probationStartDate: "",
    probationEndDate: "",
    noticePeriod: "",
    employmentType: "",
    timeType: "",
    contractStatus: "",
    payBand: "",
    payGrade: "",
    businessUnit: "",
    costCenter: "",
    legalEntity: "",
    salaryStructureId: "",
    salaryStructure: null,
    shift: "",
    weeklyOffPolicy: "",
    leavePlan: "",
    holidayCalendar: "",
    attendanceNumber: "",
    disableAttendanceTracking: false,
    attendanceCaptureScheme: "",
    shiftWeeklyOffRule: "",
    overtimePolicy: "",
    attendancePenalisationPolicy: "",
    shiftAllowancePolicy: "",
    tenantId: "",
    photoUrl: "",
    address: "",
    directReports: [],
    leaveRequests: [],
  };

  employeeId: string = "";
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get("id") || "";
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

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    const updatePayload: EmployeeUpdatePayload = {
      ...(this.employee as EmployeeUpdatePayload),
    };

    this.employeeService
      .updateEmployee(this.employeeId, updatePayload)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(["/employees"]);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            "Failed to update employee. Please try again.";
        },
      });
  }

  validateForm(): boolean {
    if (!this.employee.firstName || !this.employee.lastName) {
      this.errorMessage = "First name and last name are required";
      return false;
    }
    if (
      !this.employee.workEmail ||
      !this.isValidEmail(this.employee.workEmail)
    ) {
      this.errorMessage = "Valid email is required";
      return false;
    }
    if (!this.employee.workNumber) {
      this.errorMessage = "Phone number is required";
      return false;
    }
    if (!this.employee.departmentId) {
      this.errorMessage = "Department ID is required";
      return false;
    }
    if (!this.employee.designationId) {
      this.errorMessage = "Designation ID is required";
      return false;
    }
    if (!this.employee.salaryStructureId) {
      this.errorMessage = "Salary Structure ID is required";
      return false;
    }
    if (!this.employee.joiningDate) {
      this.errorMessage = "Joining date is required";
      return false;
    }
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onCancel(): void {
    this.router.navigate(["/employees"]);
  }
}
