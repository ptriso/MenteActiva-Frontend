// appointment-history-dialog.ts

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../shared/material/material.imports';
import { AppointmentClientDTO } from '../../../../../core/models/appointment-client.dto';

export interface HistoryDialogData {
  clientName: string;
  appointments: AppointmentClientDTO[];
}

@Component({
  selector: 'app-history-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './appointment-history-dialog.html',
  styleUrls: ['./appointment-history-dialog.css']
})
export class HistoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HistoryDialogData
  ) {
    console.log("📋 Diálogo abierto con:", this.data);
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'COMPLETADA':
        return 'primary';
      case 'CONFIRMADA':
        return 'accent';
      case 'CANCELADA':
      case 'INASISTENCIA':
        return 'warn';
      default:
        return 'accent'; // PROGRAMADA
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'COMPLETADA':
        return '✅';
      case 'CONFIRMADA':
        return '📅';
      case 'PROGRAMADA':
        return '🕒';
      case 'CANCELADA':
        return '❌';
      case 'INASISTENCIA':
        return '⚠️';
      default:
        return '📋';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); // "11:00:00" → "11:00"
  }
}
