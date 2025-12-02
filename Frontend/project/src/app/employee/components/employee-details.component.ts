import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { EmployeeService } from "../../shared/services/employee.service";
import { Employee } from "../../shared/models/employee.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";

@Component({
  selector: "app-employee-details",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./employee-details.component.html",
  styleUrls: ["./employee-details.component.css"],
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get("id");
    if (employeeId) {
      this.loadEmployee(employeeId);
    }
  }

  loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
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

  onBack(): void {
    this.router.navigate(["/employees"]);
  }

  onEdit(): void {
    if (this.employee?.id) {
      this.router.navigate(["/employees/edit", this.employee.id]);
    }
  }

  onDelete(): void {
    if (!this.employee?.id) return;

    if (confirm("Are you sure you want to delete this employee?")) {
      this.employeeService.deleteEmployee(this.employee.id).subscribe({
        next: () => {
          this.router.navigate(["/employees"]);
        },
        error: (error) => {
          alert("Failed to delete employee. Please try again.");
        },
      });
    }
  }
}
