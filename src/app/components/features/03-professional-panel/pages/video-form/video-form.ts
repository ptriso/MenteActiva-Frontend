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
  videoId: number = 0;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private profVideoService: ProfVideoService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.CargarFormulario();

    const idParam = this.route.snapshot.paramMap.get('id');
    this.videoId = idParam ? Number(idParam) : 0;

    if (this.videoId > 0) {
      this.cargarDatosParaEditar();
    }
  }

  CargarFormulario(): void {
    this.videoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      url: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(1)]]
    });
  }

  cargarDatosParaEditar() {
    const profId = this.authService.getUserId();

    // Usamos el método correcto de tu servicio (con 'Id' al final)
    this.profVideoService.getVideosByProfessionalId(Number(profId)).subscribe({
      next: (videos) => {
        const videoEncontrado = videos.find(v => v.id === this.videoId);

        if (videoEncontrado) {
          // CAMBIO 1: Asignamos el valor directo (ya es número en el DTO)
          this.videoForm.patchValue({
            title: videoEncontrado.title,
            description: videoEncontrado.description,
            url: videoEncontrado.url,
            duration: videoEncontrado.duration
          });
        } else {
          this.snackBar.open("Video no encontrado", "Cerrar");
          this.router.navigate(['/profesional/videos']);
        }
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open("Error al cargar datos", "Cerrar");
      }
    });
  }

  Grabar(): void {
    if (this.videoForm.invalid) {
      this.videoForm.markAllAsTouched();
      this.snackBar.open("Completa todos los campos obligatorios", "Cerrar");
      return;
    }

    this.isSaving = true;
    const profId = this.authService.getUserId();

    const videoDto: VideoRequestDTO = {
      title: this.videoForm.value.title,
      description: this.videoForm.value.description,
      url: this.videoForm.value.url,

      // CAMBIO 2: Enviamos SOLO el número (sin " min")
      // Esto soluciona el error 400 Bad Request
      duration: Number(this.videoForm.value.duration),

      professionalId: Number(profId)
    };

    if (this.videoId > 0) {
      // EDITAR
      this.profVideoService.updateVideo(this.videoId, videoDto).subscribe({
        next: () => this.alFinalizar("¡Video actualizado!"),
        error: (e) => this.alError(e)
      });
    } else {
      // CREAR
      this.profVideoService.createVideo(videoDto).subscribe({
        next: () => this.alFinalizar("¡Video creado exitosamente!"),
        error: (e) => this.alError(e)
      });
    }
  }

  alFinalizar(mensaje: string) {
    this.isSaving = false;
    this.snackBar.open(mensaje, "Ok", { duration: 3000 });
    this.router.navigate(['/profesional/videos']);
  }

  alError(err: any) {
    this.isSaving = false;
    console.error(err);
    this.snackBar.open("Error al guardar. Intenta de nuevo.", "Cerrar");
  }
}
