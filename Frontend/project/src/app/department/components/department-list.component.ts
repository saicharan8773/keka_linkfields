import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { DepartmentService } from "../../shared/services/department.service";
import { Department } from "../../shared/models/department.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";
import { FormsModule } from "@angular/forms";
import { DepartmentCreateComponent } from "./department-create.component";
import { DepartmentDetailsModalComponent } from "./department-details-modal/department-details-modal.component";
import { DepartmentEditModalComponent } from "./department-edit-modal/department-edit-modal.component";

@Component({
  selector: "app-department-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    FormsModule,
    DepartmentCreateComponent,
    DepartmentDetailsModalComponent,
    DepartmentEditModalComponent,
  ],
  templateUrl: "./department-list.component.html",
  styleUrls: ["./department-list.component.css"],
})
export class DepartmentListComponent implements OnInit {
  allDepartments: Department[] = [];
  departments: Department[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";
  searchText: string = "";
  showAddDepartmentModal = false;
  showEditDepartmentModal = false;
  showDetailsDepartmentModal = false;
  selectedDepartmentId: string = "";

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  onDepartmentAdded() {
    this.showAddDepartmentModal = false;
    this.loadDepartments();
  }

  onSearch(): void {
    this.updateDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.allDepartments = data;
        this.updateDepartments();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load departments. Please try again.";
        this.isLoading = false;
      },
    });
  }

  updateDepartments(): void {
    const filteredDepartments = this.allDepartments.filter(
      (department) =>
        department.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        department.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.departments = filteredDepartments;
  }

  showDetailsModal(departmentId: string): void {
    this.selectedDepartmentId = departmentId;
    this.showDetailsDepartmentModal = true;
  }

  showEditModal(departmentId: string): void {
    this.selectedDepartmentId = departmentId;
    this.showEditDepartmentModal = true;
  }

  showEditModalFromDetails(departmentId: string): void {
    this.showDetailsDepartmentModal = false;
    this.showEditModal(departmentId);
  }

  onDepartmentUpdated(): void {
    this.showEditDepartmentModal = false;
    this.loadDepartments();
  }

  navigateToEmployees(department: Department): void {
    this.router.navigate(['/employees'], {
      queryParams: { departmentId: department.id },
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
}