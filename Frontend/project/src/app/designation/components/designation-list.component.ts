import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { DesignationService } from "../../shared/services/designation.service";
import { AuthService } from "../../shared/services/auth.service";
import { Designation } from "../../shared/models/designation.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";

@Component({
  selector: "app-designation-list",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./designation-list.component.html",
  styleUrls: ["./designation-list.component.css"],
})
export class DesignationListComponent implements OnInit {
  designations: Designation[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private designationService: DesignationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.isLoading = true;
    this.errorMessage = "";

    // Hardcoded data as requested
    const hardcodedDesignations: Designation[] = [
      {
        "id": "de000000-0000-0000-0000-000000000001",
        "title": "HR Executive",
        "description": "HR Executive",
        "departmentId": "d1000000-0000-0000-0000-000000000001",
        "departmentName": "Human Resources",
        "departmentCode": "HR"
      },
      {
        "id": "de000000-0000-0000-0000-000000000002",
        "title": "HR Manager",
        "description": "HR Manager",
        "departmentId": "d1000000-0000-0000-0000-000000000001",
        "departmentName": "Human Resources",
        "departmentCode": "HR"
      },
      {
        "id": "de000000-0000-0000-0000-000000000003",
        "title": "Talent Acquisition Specialist",
        "description": "Talent Acquisition Specialist",
        "departmentId": "d1000000-0000-0000-0000-000000000001",
        "departmentName": "Human Resources",
        "departmentCode": "HR"
      },
      {
        "id": "de000000-0000-0000-0000-000000000004",
        "title": "Accountant",
        "description": "Accountant",
        "departmentId": "d1000000-0000-0000-0000-000000000002",
        "departmentName": "Financial Accounting",
        "departmentCode": "FA"
      },
      {
        "id": "de000000-0000-0000-0000-000000000005",
        "title": "Senior Accounts Manager",
        "description": "Senior Accounts Manager",
        "departmentId": "d1000000-0000-0000-0000-000000000002",
        "departmentName": "Financial Accounting",
        "departmentCode": "FA"
      },
      {
        "id": "de000000-0000-0000-0000-000000000006",
        "title": "Financial Analyst",
        "description": "Financial Analyst",
        "departmentId": "d1000000-0000-0000-0000-000000000002",
        "departmentName": "Financial Accounting",
        "departmentCode": "FA"
      },
      {
        "id": "de000000-0000-0000-0000-000000000007",
        "title": "Sales Executive",
        "description": "Sales Executive",
        "departmentId": "d1000000-0000-0000-0000-000000000003",
        "departmentName": "Marketing and Sales",
        "departmentCode": "M&S"
      },
      {
        "id": "de000000-0000-0000-0000-000000000008",
        "title": "Marketing Manager",
        "description": "Marketing Manager",
        "departmentId": "d1000000-0000-0000-0000-000000000003",
        "departmentName": "Marketing and Sales",
        "departmentCode": "M&S"
      },
      {
        "id": "de000000-0000-0000-0000-000000000009",
        "title": "Business Development Executive",
        "description": "Business Development Executive",
        "departmentId": "d1000000-0000-0000-0000-000000000003",
        "departmentName": "Marketing and Sales",
        "departmentCode": "M&S"
      },
      {
        "id": "de000000-0000-0000-0000-000000000010",
        "title": "Operations Manager",
        "description": "Operations Manager",
        "departmentId": "d1000000-0000-0000-0000-000000000004",
        "departmentName": "Operations management",
        "departmentCode": "OM"
      },
      {
        "id": "de000000-0000-0000-0000-000000000011",
        "title": "Supply Chain Coordinator",
        "description": "Supply Chain Coordinator",
        "departmentId": "d1000000-0000-0000-0000-000000000004",
        "departmentName": "Operations management",
        "departmentCode": "OM"
      },
      {
        "id": "de000000-0000-0000-0000-000000000012",
        "title": "Production Supervisor",
        "description": "Production Supervisor",
        "departmentId": "d1000000-0000-0000-0000-000000000004",
        "departmentName": "Operations management",
        "departmentCode": "OM"
      },
      {
        "id": "de000000-0000-0000-0000-000000000013",
        "title": "R&D Engineer",
        "description": "R&D Engineer",
        "departmentId": "d1000000-0000-0000-0000-000000000005",
        "departmentName": "Research and development",
        "departmentCode": "R&D"
      },
      {
        "id": "de000000-0000-0000-0000-000000000014",
        "title": "Research Scientist",
        "description": "Research Scientist",
        "departmentId": "d1000000-0000-0000-0000-000000000005",
        "departmentName": "Research and development",
        "departmentCode": "R&D"
      },
      {
        "id": "de000000-0000-0000-0000-000000000015",
        "title": "Product Development Specialist",
        "description": "Product Development Specialist",
        "departmentId": "d1000000-0000-0000-0000-000000000005",
        "departmentName": "Research and development",
        "departmentCode": "R&D"
      },
      {
        "id": "de000000-0000-0000-0000-000000000016",
        "title": "Customer Support Executive",
        "description": "Customer Support Executive",
        "departmentId": "d1000000-0000-0000-0000-000000000006",
        "departmentName": "Customer service",
        "departmentCode": "CS"
      },
      {
        "id": "de000000-0000-0000-0000-000000000017",
        "title": "Customer Success Manager",
        "description": "Customer Success Manager",
        "departmentId": "d1000000-0000-0000-0000-000000000006",
        "departmentName": "Customer service",
        "departmentCode": "CS"
      },
      {
        "id": "de000000-0000-0000-0000-000000000018",
        "title": "Call Center Representative",
        "description": "Call Center Representative",
        "departmentId": "d1000000-0000-0000-0000-000000000006",
        "departmentName": "Customer service",
        "departmentCode": "CS"
      },
      {
        "id": "de000000-0000-0000-0000-000000000019",
        "title": "Software Developer",
        "description": "Software Developer",
        "departmentId": "d1000000-0000-0000-0000-000000000007",
        "departmentName": "Information Technology",
        "departmentCode": "IT"
      },
      {
        "id": "de000000-0000-0000-0000-000000000020",
        "title": "IT Administrator",
        "description": "IT Administrator",
        "departmentId": "d1000000-0000-0000-0000-000000000007",
        "departmentName": "Information Technology",
        "departmentCode": "IT"
      },
      {
        "id": "de000000-0000-0000-0000-000000000021",
        "title": "Systems Analyst",
        "description": "Systems Analyst",
        "departmentId": "d1000000-0000-0000-0000-000000000007",
        "departmentName": "Information Technology",
        "departmentCode": "IT"
      },
      {
        "id": "de000000-0000-0000-0000-000000000022",
        "title": "IT Support Technician",
        "description": "IT Support Technician",
        "departmentId": "d1000000-0000-0000-0000-000000000008",
        "departmentName": "IT Support",
        "departmentCode": "ITS"
      },
      {
        "id": "de000000-0000-0000-0000-000000000023",
        "title": "Help Desk Specialist",
        "description": "Help Desk Specialist",
        "departmentId": "d1000000-0000-0000-0000-000000000008",
        "departmentName": "IT Support",
        "departmentCode": "ITS"
      },
      {
        "id": "de000000-0000-0000-0000-000000000024",
        "title": "Desktop Support Engineer",
        "description": "Desktop Support Engineer",
        "departmentId": "d1000000-0000-0000-0000-000000000008",
        "departmentName": "IT Support",
        "departmentCode": "ITS"
      }
    ];

    this.designations = hardcodedDesignations;
    this.isLoading = false;

    /*
    this.designationService.getAllDesignations().subscribe({
      next: (data) => {
        this.designations = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load designations. Please try again.";
        this.isLoading = false;
      },
    });
    */
  }

  onDelete(id: string | undefined): void {
    if (!id) return;

    if (confirm("Are you sure you want to delete this designation?")) {
      this.designationService.deleteDesignation(id).subscribe({
        next: () => {
          this.loadDesignations();
        },
        error: (error) => {
          alert("Failed to delete designation. Please try again.");
        },
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
