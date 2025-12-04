import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { EmployeeService } from "../../shared/services/employee.service";
import { Employee } from "../../shared/models/employee.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";
import { FormsModule } from "@angular/forms";
import { EmployeeCreateComponent } from "./employee-create.component";

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    FormsModule,
    EmployeeCreateComponent,
  ],
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";
  searchText: string = "";
  showAddEmployeeModal = false;



  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }
  onEmployeeAdded() {
    this.showAddEmployeeModal = false;
    this.loadEmployees();
  }
  onSearch(): void {
    this.searchText = this.searchText.toLowerCase();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load employees. Please try again.";
        this.isLoading = false;
      },
    });
  }

  onDelete(id: string | undefined): void {
    if (!id) return;

    if (confirm("Are you sure you want to delete this employee?")) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          alert("Failed to delete employee. Please try again.");
        },
      });
    }
  }
}
