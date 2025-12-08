import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { SalaryStructureService } from "../../shared/services/salary-structure.service";
import { SalaryStructure } from "../../shared/models/salary-structure.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";
import { FormsModule } from "@angular/forms";
import { SalaryStructureCreateComponent } from "./salary-structure-create.component";
import { SalaryStructureDetailsModalComponent } from "./salary-structure-details-modal/salary-structure-details-modal.component";
import { SalaryStructureEditModalComponent } from "./salary-structure-edit-modal/salary-structure-edit-modal.component";

@Component({
  selector: "app-salary-structure-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    FormsModule,
    SalaryStructureCreateComponent,
    SalaryStructureDetailsModalComponent,
    SalaryStructureEditModalComponent,
  ],
  templateUrl: "./salary-structure-list.component.html",
  styleUrls: ["./salary-structure-list.component.css"],
})
export class SalaryStructureListComponent implements OnInit {
  allSalaryStructures: SalaryStructure[] = [];
  salaryStructures: SalaryStructure[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";
  searchText: string = "";
  showAddSalaryStructureModal = false;
  showEditSalaryStructureModal = false;
  showDetailsSalaryStructureModal = false;
  selectedSalaryStructureId: string = "";

  constructor(
    private salaryStructureService: SalaryStructureService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalaryStructures();
  }

  onSalaryStructureAdded() {
    this.showAddSalaryStructureModal = false;
    this.loadSalaryStructures();
  }

  onSearch(): void {
    this.updateSalaryStructures();
  }

  loadSalaryStructures(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.salaryStructureService.getAllSalaryStructures().subscribe({
      next: (data) => {
        this.allSalaryStructures = data;
        this.updateSalaryStructures();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load salary structures. Please try again.";
        this.isLoading = false;
      },
    });
  }

  updateSalaryStructures(): void {
    const filteredSalaryStructures = this.allSalaryStructures.filter(
      (structure) =>
        structure.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.salaryStructures = filteredSalaryStructures;
  }

  calculateTotal(structure: SalaryStructure): number {
    return (
      (structure.basic || 0) +
      (structure.hra || 0) +
      (structure.otherAllowances || 0) -
      (structure.deductions || 0)
    );
  }

  showDetailsModal(salaryStructureId: string): void {
    this.selectedSalaryStructureId = salaryStructureId;
    this.showDetailsSalaryStructureModal = true;
  }

  showEditModal(salaryStructureId: string): void {
    this.selectedSalaryStructureId = salaryStructureId;
    this.showEditSalaryStructureModal = true;
  }

  showEditModalFromDetails(salaryStructureId: string): void {
    this.showDetailsSalaryStructureModal = false;
    this.showEditModal(salaryStructureId);
  }

  onSalaryStructureUpdated(): void {
    this.showEditSalaryStructureModal = false;
    this.loadSalaryStructures();
  }

  onDelete(id: string | undefined): void {
    if (!id) return;

    if (confirm("Are you sure you want to delete this salary structure?")) {
      this.salaryStructureService.deleteSalaryStructure(id).subscribe({
        next: () => {
          this.loadSalaryStructures();
        },
        error: (error) => {
          alert("Failed to delete salary structure. Please try again.");
        },
      });
    }
  }
}