import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { EmployeeCreatePayload } from "../../shared/models/employee.model";
import { EmployeeService } from "../../shared/services/employee.service";
import { SidebarComponent } from "../../shared/components/sidebar.component";

@Component({
  selector: "app-employee-create",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: "./employee-create.component.html",
  styleUrls: ["./employee-create.component.css"],
})
export class EmployeeCreateComponent {
  isLoading = false;
  errorMessage: string | null = null;

  // Helper property for the Custom Fields text input
  customFieldsString: string = "";

  // Visibility toggles
  sections = {
    personal: true,
    job: false,
    contract: false,
    attendance: false,
    other: false,
  };

  // Initialize the model with default values
  employee: EmployeeCreatePayload = {
    employeeCode: "",
    firstName: "",
    middleName: null,
    lastName: "",
    displayName: null,
    workEmail: "",
    personalEmail: null,
    mobileNumber: null,
    workNumber: null,
    residenceNumber: null,
    dateOfBirth: null,
    gender: null,
    maritalStatus: null,
    bloodGroup: null,
    isPhysicallyHandicapped: false,
    nationality: null,
    joiningDate: "",
    designationId: null,
    departmentId: null,
    departmentPath: null,
    managerId: null,
    locationId: null,
    jobTitlePrimary: null,
    jobTitleSecondary: null,
    isInProbation: false,
    probationStartDate: null,
    probationEndDate: null,
    noticePeriod: null,
    employmentType: "Full-Time",
    timeType: null,
    contractStatus: null,
    payBand: null,
    payGrade: null,
    businessUnit: null,
    costCenter: null,
    legalEntity: null,
    salaryStructureId: null,
    shift: null,
    weeklyOffPolicy: null,
    leavePlan: null,
    holidayCalendar: null,
    attendanceNumber: null,
    disableAttendanceTracking: false,
    attendanceCaptureScheme: null,
    shiftWeeklyOffRule: null,
    overtimePolicy: null,
    attendancePenalisationPolicy: null,
    shiftAllowancePolicy: null,
    photoUrl: null,
    address: null,
    customFields: null,
  };

  toggle(sectionName: keyof typeof this.sections) {
    this.sections[sectionName] = !this.sections[sectionName];
  }

  onCancel() {
    // Navigate away or reset form
    console.log("Cancelled");
    this.errorMessage = null;
  }

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

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

    // Process Custom Fields JSON
    if (this.customFieldsString) {
      try {
        this.employee.customFields = JSON.parse(this.customFieldsString);
      } catch (e) {
        this.errorMessage = "Invalid JSON format in Custom Fields.";
        this.isLoading = false;
        return;
      }
    }

    // Call API via EmployeeService
    console.log("Submitting Payload:", this.employee);

    this.employeeService.createEmployee(this.employee).subscribe({
      next: (created) => {
        this.isLoading = false;
        // Navigate to employees list so it reloads and shows the new entry
        this.router.navigate(["/employees"]);
      },
      error: (err) => {
        console.error("Create employee failed", err);
        this.errorMessage = "Failed to create employee. Please try again.";
        this.isLoading = false;
      },
    });
  }
}
