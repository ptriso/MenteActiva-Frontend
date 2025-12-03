// shared-history-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../shared/material/material.imports';
import { AppointmentClientDTO } from '../../../../core/models/appointment-client.dto';

interface DialogData {
  appointments: AppointmentClientDTO[];
  professionalName: string;
}

@Component({
  selector: 'app-shared-history-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="dialog-header">
      <i class="fas fa-history"></i>
      <h2 mat-dialog-title>Historial con {{ data.professionalName }}</h2>
    </div>

    <mat-dialog-content class="dialog-content">
      <p class="subtitle">Total de citas: {{ data.appointments.length }}</p>

      <div class="appointments-list">
        <div *ngFor="let appt of data.appointments" class="appointment-card">
          <div class="card-header">
            <div class="date-section">
              <i class="fas fa-calendar-day"></i>
              <span class="date-text">{{ formatDate(appt.date) }}</span>
            </div>
            <mat-chip [color]="getStatusColor(appt.status)" selected class="status-chip">
              {{ appt.status }}
            </mat-chip>
          </div>

          <div class="card-body">
            <div class="info-row">
              <i class="fas fa-clock"></i>
              <span>{{ appt.timeStart | slice:0:5 }} - {{ appt.timeEnds | slice:0:5 }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="data.appointments.length === 0" class="empty-message">
          <i class="fas fa-info-circle"></i>
          <p>No hay historial de citas con este profesional</p>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>
        <i class="fas fa-times"></i> Cerrar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 0 -24px;
    }

    .dialog-header i {
      font-size: 24px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
    }

    .dialog-content {
      padding: 24px !important;
      min-height: 200px;
      max-height: 500px;
      overflow-y: auto;
    }

    .subtitle {
      font-size: 14px;
      color: #6b778c;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .appointment-card {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      background: white;
      transition: all 0.2s;
    }

    .appointment-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .date-section {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #374151;
    }

    .date-section i {
      color: #6d28d9;
    }

    .date-text {
      font-size: 15px;
    }

    .status-chip {
      font-size: 12px !important;
      font-weight: 600 !important;
      height: 28px !important;
    }

    .card-body {
      padding-top: 8px;
      border-top: 1px solid #f3f4f6;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6b778c;
    }

    .info-row i {
      color: #10b981;
      width: 16px;
    }

    .empty-message {
      text-align: center;
      padding: 32px;
      color: #9ca3af;
    }

    .empty-message i {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .empty-message p {
      font-size: 15px;
      margin: 0;
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
    }

    button i {
      margin-right: 8px;
    }

    /* Scrollbar personalizado */
    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #6d28d9;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #5b21b6;
    }
  `]
})
export class SharedHistoryDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SharedHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    // Ordenar por fecha descendente (más reciente primero)
    this.data.appointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.timeStart}`);
      const dateB = new Date(`${b.date}T${b.timeStart}`);
      return dateB.getTime() - dateA.getTime();
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status?.toUpperCase()) {
      case 'COMPLETADA':
        return 'primary';
      case 'CONFIRMADA':
      case 'PROGRAMADA':
        return 'accent';
      case 'CANCELADA':
      case 'INASISTENCIA':
        return 'warn';
      default:
        return 'accent';
    }
  }
}
