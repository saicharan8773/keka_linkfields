import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { EmployeeService } from "../../shared/services/employee.service";
import { Employee } from "../../shared/models/employee.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";
import { FormsModule } from "@angular/forms";
import { EmployeeCreateComponent } from "./employee-create.component";
import { EmployeeEditModalComponent } from "./employee-edit-modal/employee-edit-modal.component";
import { EmployeeDetailsModalComponent } from "./employee-details-modal/employee-details-modal.component";

@Component({
  selector: "app-employee-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    FormsModule,
    EmployeeCreateComponent,
    EmployeeEditModalComponent,
    EmployeeDetailsModalComponent,
  ],
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  employees: Employee[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";
  searchText: string = "";
  showAddEmployeeModal = false;
  showEditEmployeeModal = false;
  showDetailsEmployeeModal = false;
  selectedEmployeeId: string = "";

  currentPage: number = 1;
  itemsPerPage: number = 5;

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
  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }
  onSearch(): void {
    this.currentPage = 1;
    this.filterEmployees();
    this.updatePaginatedEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.allEmployees = data;
        this.filterEmployees();
        this.updatePaginatedEmployees();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load employees. Please try again.";
        this.isLoading = false;
      },
    });
  }

  filterEmployees(): void {
    this.filteredEmployees = this.allEmployees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        employee.workEmail.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  updatePaginatedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.employees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedEmployees();
  }

  showDetailsModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;
    this.showDetailsEmployeeModal = true;
  }

  showEditModal(employeeId: string): void {
    this.selectedEmployeeId = employeeId;
    this.showEditEmployeeModal = true;
  }

  showEditModalFromDetails(employeeId: string): void {
    this.showDetailsEmployeeModal = false;
    this.showEditModal(employeeId);
  }

  onEmployeeUpdated(): void {
    this.showEditEmployeeModal = false;
    this.loadEmployees();
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
