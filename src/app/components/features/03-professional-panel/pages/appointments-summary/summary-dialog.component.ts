import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {ProfAppointmentsService} from '../../services/prof-appointments.service';


@Component({
  selector: 'app-summary-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogActions, MatDialogContent, MaterialModule],
  template: `
    <h2 mat-dialog-title>Conclusión de la Cita</h2>

    <mat-dialog-content>
      <textarea [(ngModel)]="conclusion"
                rows="5"
                placeholder="Escribe aquí la conclusión de la sesión..."
                class="summary-area"></textarea>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .summary-area {
      width: 100%;
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
    }
  `]
})
export class SummaryDialogComponent {

  conclusion = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appointmentId: number },
    private dialogRef: MatDialogRef<SummaryDialogComponent>,
    private profApptService: ProfAppointmentsService,
    private snackBar: MatSnackBar
  ) {}

  save(): void {
    if (!this.conclusion.trim()) {
      this.snackBar.open('La conclusión no puede estar vacía', 'Cerrar', { duration: 2500 });
      return;
    }

    this.profApptService.saveSummary(
      this.data.appointmentId,
      this.conclusion.trim()
    ).subscribe({
      next: () => {
        this.snackBar.open('Conclusión guardada', 'Cerrar', { duration: 2500 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error al guardar la conclusión', 'Cerrar', { duration: 2500 });
      }
    });
  }
}
