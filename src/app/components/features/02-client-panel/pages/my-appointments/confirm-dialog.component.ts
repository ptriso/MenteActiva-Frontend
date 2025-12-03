// confirm-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material/material.imports';

interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="dialog-header">
      <i class="fas fa-exclamation-triangle"></i>
      <h2 mat-dialog-title>{{ data.title }}</h2>
    </div>

    <mat-dialog-content class="dialog-content">
      <p class="message-text">{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" class="cancel-btn">
        <i class="fas fa-times"></i> {{ data.cancelText || 'No, volver' }}
      </button>
      <button mat-raised-button color="warn" (click)="onConfirm()" class="confirm-btn">
        <i class="fas fa-check"></i> {{ data.confirmText || 'Sí, cancelar cita' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%);
      color: white;
      margin: -24px -24px 0 -24px;
    }

    .dialog-header i {
      font-size: 24px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
    }

    .dialog-content {
      padding: 24px !important;
      min-height: 80px;
    }

    .message-text {
      font-size: 15px;
      line-height: 1.6;
      color: #374151;
      margin: 0;
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
      gap: 12px;
    }

    button {
      font-size: 14px !important;
      font-weight: 500 !important;
      padding: 8px 20px !important;
    }

    button i {
      margin-right: 8px;
    }

    .cancel-btn {
      color: #6b778c !important;
    }

    .confirm-btn {
      background-color: #dc2626 !important;
      color: white !important;
    }

    .confirm-btn:hover {
      background-color: #b91c1c !important;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
