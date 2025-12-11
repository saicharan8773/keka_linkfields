import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-reject-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./reject-modal.component.html",
  styleUrls: ["./reject-modal.component.css"],
})
export class RejectModalComponent {
  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  isOpen = false;
  rejectionNote = "";
  isSubmitting = false;

  open() {
    this.isOpen = true;
    this.rejectionNote = "";
    this.isSubmitting = false;
  }

  close() {
    this.isOpen = false;
    this.rejectionNote = "";
    this.isSubmitting = false;
  }

  onConfirm() {
    if (!this.rejectionNote.trim() || this.isSubmitting) return;

    this.isSubmitting = true;
    this.confirmed.emit(this.rejectionNote.trim());

    // Reset after emission
    setTimeout(() => {
      this.close();
    }, 500);
  }

  onCancel() {
    this.cancelled.emit();
    this.close();
  }
}
