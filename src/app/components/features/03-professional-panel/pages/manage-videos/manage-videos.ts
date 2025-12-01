import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms'; // Para el buscador
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfVideoService } from '../../services/prof-video.service';
import { AuthService } from '../../../../core/services/auth';
import { VideoResponseDTO } from '../../../../core/models/video.dto';
import { ConfirmAppointmentDialogComponent } from '../../../../shared/components/confirm-appointment-dialog/confirm-appointment-dialog';

@Component({
  selector: 'app-manage-videos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './manage-videos.html',
  styleUrls: ['./manage-videos.css']
})
export class ManageVideos implements OnInit {

  listaCompletaVideos: VideoResponseDTO[] = [];
  videosFiltrados: VideoResponseDTO[] = [];
  videosMasVistos: any[] = []; // Usamos 'any' porque el DTO del ranking es distinto

  mostrarMasVistos = false;
  searchControl = new FormControl('');
  loading = true;

  constructor(
    private profVideoService: ProfVideoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarVideos();
    this.escucharBuscador();
  }

  // 1. Carga la lista normal de videos
  cargarVideos(): void {
    const profId = this.authService.getUserId();

    this.profVideoService.getVideosByProfessionalId(Number(profId)).subscribe({
      next: (data) => {
        this.listaCompletaVideos = data;
        this.videosFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // 2. Buscador en tiempo real
  escucharBuscador(): void {
    this.searchControl.valueChanges.subscribe(searchTerm => {
      const term = (searchTerm || '').toLowerCase();
      this.videosFiltrados = this.listaCompletaVideos.filter(video =>
        video.title.toLowerCase().includes(term) ||
        (video.description && video.description.toLowerCase().includes(term))
      );
    });
  }

  // 3. Lógica del Ranking (Filtrado Frontend)
  toggleMasVistos(): void {
    this.mostrarMasVistos = !this.mostrarMasVistos;

    if (this.mostrarMasVistos && this.videosMasVistos.length === 0) {

      const myId = this.authService.getUserId();

      this.profVideoService.getMostViewedVideos().subscribe({
        next: (data) => {
          console.log("Ranking Global:", data);
          this.videosMasVistos = data.filter((v: any) => {
            return Number(v.author_id) === Number(myId);
          });
        },
        error: (err) => console.error("Error al cargar ranking", err)
      });
    }
  }

  // 4. Borrar Video
  borrarVideo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmAppointmentDialogComponent, {
      width: '400px',
      data: {
        schedule: { date: 'este video', time_start: 'permanentemente' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profVideoService.deleteVideo(id).subscribe({
          next: () => {
            this.snackBar.open("Video eliminado", "Ok", { duration: 3000 });
            this.cargarVideos(); // Recargar lista
            this.videosMasVistos = [];
          },
          error: () => this.snackBar.open("Error al eliminar", "Cerrar")
        });
      }
    });
  }
  getDurationInMinutes(duration: any): number {
    const seconds = Number(duration);
    if (isNaN(seconds)) return 0;
    return Math.floor(seconds / 60);
  }
}
