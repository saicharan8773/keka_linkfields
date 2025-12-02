import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { SalaryStructureService } from "../../shared/services/salary-structure.service";
import { AuthService } from "../../shared/services/auth.service";
import { SalaryStructure } from "../../shared/models/salary-structure.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";

@Component({
  selector: "app-salary-structure-list",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./salary-structure-list.component.html",
  styleUrls: ["./salary-structure-list.component.css"],
})
export class SalaryStructureListComponent implements OnInit {
  salaryStructures: SalaryStructure[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private salaryStructureService: SalaryStructureService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalaryStructures();
  }

  loadSalaryStructures(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.salaryStructureService.getAllSalaryStructures().subscribe({
      next: (data) => {
        this.salaryStructures = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          "Failed to load salary structures. Please try again.";
        this.isLoading = false;
      },
    });
  }

  calculateTotal(structure: SalaryStructure): number {
    return (
      (structure.basic || 0) +
      (structure.hra || 0) +
      (structure.otherAllowances || 0) -
      (structure.deductions || 0)
    );
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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
