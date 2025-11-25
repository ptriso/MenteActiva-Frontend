import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfVideoService } from '../../services/prof-video.service';
import { AuthService } from '../../../../core/services/auth';
import { VideoRequestDTO } from '../../../../core/models/video.dto';

@Component({
  selector: 'app-video-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './video-form.html',
  styleUrls: ['./video-form.css']
})
export class VideoForm implements OnInit {

  videoForm!: FormGroup;
  videoId: number = 0; // Para saber si estamos editando

  constructor(
    private fb: FormBuilder,
    private profVideoService: ProfVideoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute // Para leer el ID de la URL
  ) {}

  ngOnInit(): void {
    this.CargarFormulario();

    // Lógica de "Editar" (como la de tu profesor [cite: 73-82])
    this.videoId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.videoId > 0) {
      // (Descomenta esto cuando tengamos la ruta GET /Videos/{id})
      /*
      this.profVideoService.getVideoById(this.videoId).subscribe({
        next: (data) => {
          this.videoForm.patchValue({
            title: data.title,
            descripcion: data.descripcion,
            url: data.url,
            duration: data.duration
          });
        },
        error: (err) => {
          this.snackBar.open("Error al cargar el video", "Cerrar", { duration: 3000 });
          console.error(err);
        }
      });
      */
    }
  }

  CargarFormulario(): void {
    this.videoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      url: ['', [Validators.required]],
      duration: ['', [Validators.required]] // (Tu HTML pide 'number', pero el DTO es 'string')
    });
  }

  Grabar(): void {
    if (this.videoForm.invalid) {
      this.videoForm.markAllAsTouched();
      this.snackBar.open("Por favor, completa todos los campos.", "Cerrar", { duration: 3000 });
      return;
    }

    const profId = this.authService.getUserId();

    const videoDto: VideoRequestDTO = {
      title: this.videoForm.get('title')?.value,
      descripcion: this.videoForm.get('descripcion')?.value,
      url: this.videoForm.get('url')?.value,
      duration: `${this.videoForm.get('duration')?.value} min`, // Convertimos a string
      professional_id: profId
    };

    if (this.videoId > 0) {
      // --- MODO EDICIÓN ---
      this.profVideoService.updateVideo(this.videoId, videoDto).subscribe({
        next: () => {
          this.snackBar.open("Video actualizado con éxito", "Ok", { duration: 3000 });
          this.router.navigate(['/profesional/videos']); // Volvemos a la lista
        },
        error: (err) => this.snackBar.open("Error al actualizar", "Cerrar", { duration: 5000 })
      });
    } else {
      // --- MODO NUEVO ---
      this.profVideoService.createVideo(videoDto).subscribe({
        next: () => {
          this.snackBar.open("Video registrado con éxito", "Ok", { duration: 3000 });
          this.router.navigate(['/profesional/videos']); // Volvemos a la lista
        },
        error: (err) => this.snackBar.open("Error al registrar", "Cerrar", { duration: 5000 })
      });
    }
  }
}
