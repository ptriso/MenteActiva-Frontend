import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../shared/material/material.imports';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VideoProgressService} from '../services/video-progress.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {VideoProgressRequestDTO} from '../../../core/models/video-progress.dto';

export interface RegisterProgressDialogData {
  clientId: number;
  videos: VideoDTO[];
}
export interface VideoDTO {
  id: number;
  title: string;
  url: string;
  duration: number;          // minutos
  professionalName?: string; // <-- IMPORTANTE: debe llamarse igual que en el backend
}
@Component({
  selector: 'app-register-progresss-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register-progresss-dialog.html',
  styleUrl: './register-progresss-dialog.css',
})
export class RegisterProgresssDialog {
  form: FormGroup;
  selectedVideo: VideoDTO | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RegisterProgressDialogData,
    private dialogRef: MatDialogRef<RegisterProgresssDialog>,
    private fb: FormBuilder,
    private progressService: VideoProgressService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      videoId: [null, Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.form.get('videoId')?.valueChanges.subscribe((id: number) => {
      this.selectedVideo = this.data.videos.find(v => v.id === id) || null;
    });
  }

  get completedLabel(): string {
    const p = this.form.get('percentage')?.value ?? 0;
    return p === 100 ? 'Sí' : 'No';
  }

  save(): void {
    if (this.form.invalid || !this.selectedVideo) {
      this.snackBar.open('Completa los campos obligatorios.', 'Cerrar', { duration: 3000 });
      return;
    }

    const percentage = this.form.value.percentage ?? 0;

    const dto: VideoProgressRequestDTO = {
      clientId: this.data.clientId,
      videoId: this.selectedVideo.id,
      percentage,
      completed: percentage === 100,
      current_time: 0,
      views_count: 1
    };

    this.progressService.create(dto).subscribe({
      next: () => {
        this.snackBar.open('Progreso registrado correctamente', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al registrar progreso:', err);
        this.snackBar.open('No tienes permisos para registrar este progreso.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
