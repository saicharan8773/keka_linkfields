import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { DesignationService } from "../../shared/services/designation.service";
import { Designation } from "../../shared/models/designation.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";
import { FormsModule } from "@angular/forms";
import { DesignationCreateComponent } from "./designation-create.component";
import { DesignationDetailsModalComponent } from "./designation-details-modal/designation-details-modal.component";
import { DesignationEditModalComponent } from "./designation-edit-modal/designation-edit-modal.component";
import { DeleteConfirmationModalComponent } from "../../shared/components/delete-confirmation-modal.component";
import { ToastService } from "../../shared/services/toast.service";
import { ToastComponent } from "../../shared/components/toast.component";

@Component({
  selector: "app-designation-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    FormsModule,
    DesignationCreateComponent,
    DesignationDetailsModalComponent,
    DesignationEditModalComponent,
    DeleteConfirmationModalComponent,
    ToastComponent,
  ],
  templateUrl: "./designation-list.component.html",
  styleUrls: ["./designation-list.component.css"],
})
export class DesignationListComponent implements OnInit {
  allDesignations: Designation[] = [];
  filteredDesignations: Designation[] = [];
  designations: Designation[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";
  searchText: string = "";
  showAddDesignationModal = false;
  showEditDesignationModal = false;
  showDetailsDesignationModal = false;
  selectedDesignationId: string = "";
  showDeleteModal = false;
  designationToDelete: string | undefined = undefined;
  isDeleting = false;

  currentPage = 1;
  itemsPerPage = 4;

  constructor(
    private designationService: DesignationService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  navigateToEmployees(designation: Designation): void {
    this.router.navigate(['/employees'], {
      queryParams: { designationId: designation.id },
    });
  }

  onDesignationAdded() {
    this.showAddDesignationModal = false;
    this.loadDesignations();
    this.toastService.success("Designation added successfully!");
  }

  onSearch(): void {
    this.currentPage = 1;
    this.filterDesignations();
    this.updatePaginatedDesignations();
  }

  loadDesignations(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.designationService.getAllDesignations().subscribe({
      next: (data) => {
        this.allDesignations = data;
        this.filterDesignations();
        this.updatePaginatedDesignations();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load designations. Please try again.";
        this.isLoading = false;
        this.toastService.error("Failed to load designations");
      },
    });
  }

  filterDesignations(): void {
    this.filteredDesignations = this.allDesignations.filter((designation) =>
      designation.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  updatePaginatedDesignations(): void {
    const startIdx = (this.currentPage - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    this.designations = this.filteredDesignations.slice(startIdx, endIdx);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedDesignations();
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredDesignations.length / this.itemsPerPage)
    );
  }

  showDetailsModal(designationId: string): void {
    this.selectedDesignationId = designationId;
    this.showDetailsDesignationModal = true;
  }

  showEditModal(designationId: string): void {
    this.selectedDesignationId = designationId;
    this.showEditDesignationModal = true;
  }

  showEditModalFromDetails(designationId: string): void {
    this.showDetailsDesignationModal = false;
    this.showEditModal(designationId);
  }

  onDesignationUpdated(): void {
    this.showEditDesignationModal = false;
    this.loadDesignations();
    this.toastService.success("Designation updated successfully!");
  }

  onDelete(id: string | undefined): void {
    if (!id) return;
    this.designationToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.designationToDelete) return;

    this.isDeleting = true;
    this.designationService
      .deleteDesignation(this.designationToDelete)
      .subscribe({
        next: () => {
          this.isDeleting = false;
          this.showDeleteModal = false;
          this.designationToDelete = undefined;
          this.loadDesignations();
          this.toastService.success("Designation deleted successfully!");
        },
        error: (error) => {
          this.isDeleting = false;
          this.showDeleteModal = false;
          this.designationToDelete = undefined;
          this.toastService.error(
            "Failed to delete designation. Please try again."
          );
        },
      });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.designationToDelete = undefined;
  }
}
