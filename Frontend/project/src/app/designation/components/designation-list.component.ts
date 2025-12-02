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
  ) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations(): void {
    this.isLoading = true;
    this.errorMessage = "";

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
