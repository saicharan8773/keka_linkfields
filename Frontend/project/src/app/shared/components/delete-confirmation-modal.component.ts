import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-delete-confirmation-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="icon-warning">
            <span class="material-icons md-32 color-danger">delete</span>
          </div>
          <h2>Confirm Deletion</h2>
        </div>

        <div class="modal-body">
          <p>{{ message }}</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>

        <div class="modal-footer">
          <button
            class="btn-cancel"
            (click)="onCancel()"
            [disabled]="isDeleting"
          >
            Cancel
          </button>
          <button
            class="btn-delete"
            (click)="onConfirm()"
            [disabled]="isDeleting"
          >
            <span *ngIf="!isDeleting">Delete</span>
            <span *ngIf="isDeleting">Deleting...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
      }

      .modal-content {
        background: white;
        border-radius: 16px;
        padding: 0;
        max-width: 350px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.5s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-header {
        padding: 20px 20px 20px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
      }

      .icon-warning {
        margin: 0 auto 16px;
        width: 64px;
        height: 64px;
        background: #ffebee;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-warning .material-icons {
        font-size: 30px;
        color: #dc3545;
      }

      .modal-header h2 {
        font-size: 24px;
        font-weight: 700;
        color: #283a4d;
      }

      .modal-body {
        padding: 10px 20px;
      }

      .modal-body p {
        margin: 0 0 1px;
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }

      .warning-text {
        font-size: 14px;
        color: #999;
        font-style: italic;
      }

      .modal-footer {
        padding: 20px 32px 32px;
        display: flex;
        gap: 2px;
        justify-content: flex-end;
      }

      .btn-cancel,
      .btn-delete {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 100px;
      }

      .btn-cancel {
        background: #f5f5f5;
        color: #555;
      }

      .btn-cancel:hover:not(:disabled) {
        background: #e0e0e0;
      }

      .btn-delete {
        background: #dc3545;
        color: white;
      }

      .btn-delete:hover:not(:disabled) {
        background: #c82333;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
      }

      .btn-cancel:disabled,
      .btn-delete:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @media (max-width: 576px) {
        .modal-content {
          width: 95%;
        }

        .modal-header,
        .modal-body,
        .modal-footer {
          padding-left: 20px;
          padding-right: 20px;
        }

        .modal-footer {
          flex-direction: column-reverse;
        }

        .btn-cancel,
        .btn-delete {
          width: 100%;
        }
      }
    `,
  ],
})
export class DeleteConfirmationModalComponent {
  @Input() message: string = "Are you sure you want to delete this record?";
  @Input() isDeleting: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
