import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MaterialModule} from '../../material/material.imports';
import {ScheduleResponseDTO} from '../../../core/models/schedule.dto';

export interface DialogData {
  schedule: ScheduleResponseDTO;
  professionalName: string;
}

@Component({
  selector: 'app-confirm-appointment-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './confirm-appointment-dialog.html',
  styleUrls: ['./confirm-appointment-dialog.css']
})
export class ConfirmAppointmentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
