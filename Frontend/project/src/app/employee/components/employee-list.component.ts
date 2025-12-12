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
import { DeleteConfirmationModalComponent } from "../../shared/components/delete-confirmation-modal.component";
import { ToastService } from "../../shared/services/toast.service";
import { ToastComponent } from "../../shared/components/toast.component";

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
    DeleteConfirmationModalComponent,
    ToastComponent,
  ],
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  employees: Employee[] = [];

  isLoading = false;
  errorMessage = "";
  searchText = "";
  departmentId: string | null = null;

  showAddEmployeeModal = false;
  showEditEmployeeModal = false;
  showDetailsEmployeeModal = false;
  selectedEmployeeId = "";
  showFilterPanel = false;
  showDeleteModal = false;
  employeeToDelete: string | undefined = undefined;
  isDeleting = false;

  currentPage = 1;
  itemsPerPage = 4;

  // Dropdowns
  departments: any[] = [];
  designations: any[] = [];
  locations: any[] = [];

  // Filter selections
  filterDepartmentId = "";
  filterDesignationId = "";
  filterLocationId = "";
  filterEmploymentType = "";

  constructor(
    private employeeService: EmployeeService,
    private dropdownService: DropdownService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.fetchDropdowns();

    this.route.queryParams.subscribe((params) => {
      this.departmentId = params["departmentId"] || null;

      if (this.departmentId) {
        this.filterDepartmentId = this.departmentId;
      }

      this.loadEmployees();
    });
  }

  fetchDropdowns() {
    this.dropdownService.getDepartments().subscribe((d) => (this.departments = d));
    this.dropdownService.getDesignations().subscribe((d) => (this.designations = d));
    this.dropdownService.getLocations().subscribe((d) => (this.locations = d));
  }

  // SEARCH + FILTER + BACKEND FILTERS
  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = "";

    const filters = {
      query: this.searchText,
      departmentId: this.filterDepartmentId,
      designationId: this.filterDesignationId,
      locationId: this.filterLocationId,
      employmentType: this.filterEmploymentType,
      pageSize: 10000
    };

    this.employeeService.getAllEmployees(filters).subscribe({
      next: (data) => {
        this.allEmployees = data;
        this.filterEmployees();
        this.updatePaginatedEmployees();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Failed to load employees. Please try again.";
        this.isLoading = false;
        this.toastService.error('Failed to load employees');
      },
    });
  }

  // FULL FILTER LOGIC HERE
  filterEmployees(): void {
    this.filteredEmployees = this.allEmployees.filter((e) => {
      const matchesSearch =
        e.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.workEmail.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesDepartment = !this.filterDepartmentId || e.departmentId === this.filterDepartmentId;
      const matchesDesignation = !this.filterDesignationId || e.designationId === this.filterDesignationId;
      const matchesLocation = !this.filterLocationId || e.locationId === this.filterLocationId;
      const matchesEmploymentType =
        !this.filterEmploymentType || e.employmentType === this.filterEmploymentType;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesLocation &&
        matchesEmploymentType
      );
    });
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadEmployees();
    this.showFilterPanel = false;
  }

  clearFilters() {
    this.filterDepartmentId = "";
    this.filterDesignationId = "";
    this.filterLocationId = "";
    this.filterEmploymentType = "";
    this.searchText = "";
    this.currentPage = 1;

    this.loadEmployees();
    this.showFilterPanel = false;
  }

  onSearch() {
    this.currentPage = 1;
    this.filterEmployees();
    this.updatePaginatedEmployees();
  }

  updatePaginatedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.employees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedEmployees();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  showDetailsModal(id: string) {
    this.selectedEmployeeId = id;
    this.showDetailsEmployeeModal = true;
  }

  showEditModal(id: string) {
    this.selectedEmployeeId = id;
    this.showEditEmployeeModal = true;
  }

  showEditModalFromDetails(id: string) {
    this.showDetailsEmployeeModal = false;
    this.showEditModal(id);
  }

  onEmployeeAdded() {
    this.showAddEmployeeModal = false;
    this.loadEmployees();
    this.toastService.success('Employee added successfully!');
  }

  onEmployeeUpdated() {
    this.showEditEmployeeModal = false;
    this.loadEmployees();
    this.toastService.success('Employee updated successfully!');
  }

  onDelete(id: string | undefined): void {
    if (!id) return;
    this.employeeToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.employeeToDelete) return;

    this.isDeleting = true;
    this.employeeService.deleteEmployee(this.employeeToDelete).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.employeeToDelete = undefined;
        this.loadEmployees();
        this.toastService.success('Employee deleted successfully!');
      },
      error: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.employeeToDelete = undefined;
        this.toastService.error('Failed to delete employee. Please try again.');
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = undefined;
  }
}
