import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importamos MAT_DIALOG_DATA para recibir datos y MatDialogRef para cerrarlo
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MaterialModule} from '../../material/material.imports';
import {ScheduleResponseDTO} from '../../../core/models/schedule.dto';

// Interface para los datos que este diálogo recibirá
export interface DialogData {
  schedule: ScheduleResponseDTO; // <-- Recibe el ScheduleResponseDTO completo
  professionalName: string; // <-- Opcional: Para mostrar el nombre del profesional
}

@Component({
  selector: 'app-confirm-appointment-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-appointment-dialog.html',
  styleUrls: ['./confirm-appointment-dialog.css']
})
export class ConfirmAppointmentDialogComponent {

  // Inyectamos los datos y la referencia al diálogo
  constructor(
    public dialogRef: MatDialogRef<ConfirmAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  // Se llama al hacer clic en "Cancelar"
  onNoClick(): void {
    this.dialogRef.close(false); // Devuelve 'false'
  }

  // Se llama al hacer clic en "Confirmar"
  onConfirm(): void {
    this.dialogRef.close(true); // Devuelve 'true'
  }
}
