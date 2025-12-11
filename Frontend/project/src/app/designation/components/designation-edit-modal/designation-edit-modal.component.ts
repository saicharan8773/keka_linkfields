import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DesignationService } from "../../../shared/services/designation.service";
import { DesignationUpdatePayload } from "../../../shared/models/designation.model";
import { DropdownService } from "../../../shared/services/dropdown.service";

@Component({
  selector: "app-designation-edit-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./designation-edit-modal.component.html",
  styleUrls: ["./designation-edit-modal.component.css"],
})
export class DesignationEditModalComponent implements OnInit, OnChanges {
  @Input() designationId: string = "";
  @Output() closeModal = new EventEmitter<void>();
  @Output() designationUpdated = new EventEmitter<void>();

  designation: DesignationUpdatePayload = {
    title: "",
    description: "",
    departmentId: "",
  };
  isLoading: boolean = false;
  errorMessage: string = "";
  departments: any[] = [];

  constructor(
    private designationService: DesignationService,
    private dropdownService: DropdownService
  ) {}
  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.dropdownService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
      },
      error: () => {
        this.departments = [];
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["designationId"] && this.designationId) {
      this.loadDesignation();
    }
  }

  loadDesignation(): void {
    this.isLoading = true;
    this.designationService.getDesignationById(this.designationId).subscribe({
      next: (data) => {
        this.designation = {
          title: data.title,
          description: data.description || "",
          departmentId: data.departmentId || "",
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = "Failed to load designation details.";
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.designation.title) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    this.designationService
      .updateDesignation(this.designationId, this.designation)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.designationUpdated.emit();
          this.onClose();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = "Failed to update designation. Please try again.";
        },
      });
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
