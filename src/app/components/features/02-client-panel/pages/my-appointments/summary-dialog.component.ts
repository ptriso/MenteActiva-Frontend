import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MaterialModule} from '../../../../shared/material/material.imports';


@Component({
  selector: 'app-summary-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <h2 mat-dialog-title>Conclusión de la cita</h2>

    <mat-dialog-content>
      <p>{{ data.summary }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class SummaryDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { summary: string }
  ) {}
}
