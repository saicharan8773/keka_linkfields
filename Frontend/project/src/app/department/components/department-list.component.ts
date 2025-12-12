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
import { DeleteConfirmationModalComponent } from "../../shared/components/delete-confirmation-modal.component";
import { ToastService } from "../../shared/services/toast.service";
import { ToastComponent } from "../../shared/components/toast.component";

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
    DeleteConfirmationModalComponent,
    ToastComponent,
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

  // Pagination
  currentPage = 1;
  itemsPerPage = 4;
  totalItems = 0;

  showAddDepartmentModal = false;
  showEditDepartmentModal = false;
  showDetailsDepartmentModal = false;
  selectedDepartmentId: string = "";
  showDeleteModal = false;
  departmentToDelete: string | undefined = undefined;
  isDeleting = false;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  onDepartmentAdded() {
    this.showAddDepartmentModal = false;
    this.loadDepartments();
    this.toastService.success("Department added successfully!");
  }

  onSearch(): void {
    this.currentPage = 1;
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
      error: () => {
        this.errorMessage = "Failed to load departments. Please try again.";
        this.isLoading = false;
        this.toastService.error("Failed to load departments");
      },
    });
  }

  updateDepartments(): void {
    const filteredDepartments = this.allDepartments.filter(
      (department) =>
        department.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        department.code.toLowerCase().includes(this.searchText.toLowerCase())
    );

    this.totalItems = filteredDepartments.length;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.departments = filteredDepartments.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDepartments();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
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
    this.toastService.success("Department updated successfully!");
  }

  navigateToEmployees(department: Department): void {
    this.router.navigate(["/employees"], {
      queryParams: { departmentId: department.id },
    });
  }

  onDelete(id: string | undefined): void {
    if (!id) return;
    this.departmentToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.departmentToDelete) return;

    this.isDeleting = true;
    this.departmentService.deleteDepartment(this.departmentToDelete).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.departmentToDelete = undefined;
        this.loadDepartments();
        this.toastService.success("Department deleted successfully!");
      },
      error: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.departmentToDelete = undefined;
        this.toastService.error(
          "Failed to delete department. Please try again."
        );
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.departmentToDelete = undefined;
  }
}
