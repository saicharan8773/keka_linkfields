import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-approve-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./approve-modal.component.html",
  styleUrls: ["./approve-modal.component.css"],
})
export class ApproveModalComponent {
  @Output() confirmed = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  isOpen = false;
  approveMessage = "";
  isSubmitting = false;

  open() {
    this.isOpen = true;
    this.approveMessage = "";
    this.isSubmitting = false;
  }

  close() {
    this.isOpen = false;
    this.approveMessage = "";
    this.isSubmitting = false;
  }

  onConfirm() {
    if (!this.approveMessage.trim() || this.isSubmitting) return;
    this.isSubmitting = true;
    this.confirmed.emit(this.approveMessage.trim());
    setTimeout(() => {
      this.close();
    }, 500);
  }

  onCancel() {
    this.cancelled.emit();
    this.close();
  }
}
