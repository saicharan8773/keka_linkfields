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
  ],
  templateUrl: "./designation-list.component.html",
  styleUrls: ["./designation-list.component.css"],
})
export class DesignationListComponent implements OnInit {
  allDesignations: Designation[] = [];
  designations: Designation[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";
  searchText: string = "";
  showAddDesignationModal = false;
  showEditDesignationModal = false;
  showDetailsDesignationModal = false;
  selectedDesignationId: string = "";

  constructor(
    private designationService: DesignationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  onDesignationAdded() {
    this.showAddDesignationModal = false;
    this.loadDesignations();
  }

  onSearch(): void {
    this.updateDesignations();
  }

  loadDesignations(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.designationService.getAllDesignations().subscribe({
      next: (data) => {
        this.allDesignations = data;
        this.updateDesignations();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load designations. Please try again.";
        this.isLoading = false;
      },
    });
  }

  updateDesignations(): void {
    const filteredDesignations = this.allDesignations.filter(
      (designation) =>
        designation.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.designations = filteredDesignations;
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
}