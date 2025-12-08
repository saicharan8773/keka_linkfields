import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { EmployeeService } from "../../shared/services/employee.service";
import { Employee } from "../../shared/models/employee.model";
import { SidebarComponent } from "../../shared/components/sidebar.component";
import { FormsModule } from "@angular/forms";
import { EmployeeCreateComponent } from "./employee-create.component";
import { EmployeeEditModalComponent } from "./employee-edit-modal/employee-edit-modal.component";
import { EmployeeDetailsModalComponent } from "./employee-details-modal/employee-details-modal.component";
import { DropdownService } from "../../shared/services/dropdown.service";

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
  departmentId: string | null = null;
  showAddEmployeeModal = false;
  showEditEmployeeModal = false;
  showDetailsEmployeeModal = false;
  selectedEmployeeId: string = "";
  showFilterPanel = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Filter Data
  departments: any[] = [];
  designations: any[] = [];
  locations: any[] = [];

  // Selected Filters
  filterDepartmentId: string = "";
  filterDesignationId: string = "";
  filterLocationId: string = "";
  filterEmploymentType: string = "";

  constructor(
    private employeeService: EmployeeService,
    private dropdownService: DropdownService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchDropdowns();
    this.route.queryParams.subscribe((params) => {
      this.departmentId = params["departmentId"] || null;
      if (this.departmentId) {
        this.filterDepartmentId = this.departmentId;
      }
      if (this.departmentId) {
        this.filterDepartmentId = this.departmentId;
        this.loadEmployees();
      } else {
        this.loadEmployees();
      }
    });
  }

  fetchDropdowns() {
    this.dropdownService
      .getDepartments()
      .subscribe((data) => (this.departments = data));
    this.dropdownService
      .getDesignations()
      .subscribe((data) => (this.designations = data));
    this.dropdownService
      .getLocations()
      .subscribe((data) => (this.locations = data));
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

    const filters = {
      query: this.searchText,
      departmentId: this.filterDepartmentId,
      designationId: this.filterDesignationId,
      locationId: this.filterLocationId,
      employmentType: this.filterEmploymentType,
      pageSize: 10000 // Get all matching for client-side pagination
    };

    this.employeeService.getAllEmployees(filters).subscribe({
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
