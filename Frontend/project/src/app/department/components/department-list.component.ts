import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { DepartmentService } from "../../shared/services/department.service";
import { AuthService } from "../../shared/services/auth.service";
import { Department } from "../../shared/models/department.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";

@Component({
  selector: "app-department-list",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.css"],
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load departments. Please try again.";
        this.isLoading = false;
      },
    });
  }

  onDelete(id: string | undefined): void {
    if (!id) return;

    if (confirm("Are you sure you want to delete this department?")) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (error) => {
          alert("Failed to delete department. Please try again.");
        },
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
