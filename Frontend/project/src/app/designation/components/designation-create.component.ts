import { Component, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DesignationService } from "../../shared/services/designation.service";
import { DesignationCreatePayload } from "../../shared/models/designation.model";
import { DropdownService } from "../../shared/services/dropdown.service";

@Component({
  selector: "app-designation-create",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./designation-create.component.html",
  styleUrls: ["./designation-create.component.css"],
})
export class DesignationCreateComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() designationAdded = new EventEmitter<void>();

  designation: DesignationCreatePayload = {
    title: "",
    description: "",
    departmentId: "",
  };
  departments: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = "";

  constructor(
    private designationService: DesignationService,
    private dropDownService: DropdownService
  ) {}
  ngOnInit() {
    this.getDepartments();
  }

  onCancel() {
    this.closeModal.emit();
  }
  getDepartments() {
    this.dropDownService.getDepartments().subscribe((res) => {
      this.departments = res;
    });
  }
  onSubmit(): void {
    if (!this.designation.title) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.designationService.createDesignation(this.designation).subscribe({
      next: () => {
        this.isLoading = false;
        this.designationAdded.emit();
        this.closeModal.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "Failed to create designation. Please try again.";
      },
    });
  }
}
