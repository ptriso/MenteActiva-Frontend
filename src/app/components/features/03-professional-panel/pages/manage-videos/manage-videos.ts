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
  videosMasVistos: any[] = [];

  mostrarMasVistos = false;
  searchControl = new FormControl('');

  constructor(
    private profVideoService: ProfVideoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
    this.cargarVideos();
    this.escucharBuscador(); // Lógica de tu script [cite: 573-580]
  }


  cargarVideos(): void {
    const profId = this.authService.getUserId();
    if (profId == null) {
      this.snackBar.open(
        'Error: No se pudo identificar al profesional. Inicia sesión nuevamente.',
        'Cerrar',
        { duration: 4000 }
      );
      return;
    }
    this.profVideoService.getVideosByProfessionalId(profId).subscribe({
      next: (data) => {
        // Filtramos solo los videos de este profesional
        this.listaCompletaVideos = data.filter(v => v.professional_id === profId);
        this.videosFiltrados = this.listaCompletaVideos;
      },
      error: (err) => console.error(err)
    });
  }

  // Lógica de tu script de búsqueda [cite: 573-580]
  escucharBuscador(): void {
    this.searchControl.valueChanges.subscribe(searchTerm => {
      const term = (searchTerm || '').toLowerCase();
      this.videosFiltrados = this.listaCompletaVideos.filter(video =>
        video.title.toLowerCase().includes(term)
      );
    });
  }

  // Lógica de tu script de "Más Vistos" [cite: 570-572]
  toggleMasVistos(): void {
    this.mostrarMasVistos = !this.mostrarMasVistos;
    if (this.mostrarMasVistos && this.videosMasVistos.length === 0) {
      this.profVideoService.getMostViewedVideos().subscribe(data => {
        this.videosMasVistos = data;
      });
    }
  }

  // Lógica de borrado (como la de tu profesor)
  borrarVideo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmAppointmentDialogComponent, {
      width: '400px',
      data: {
        // Pasamos datos genéricos al diálogo de confirmación
        schedule: { date: 'este video', time_start: 'permanentemente' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profVideoService.deleteVideo(id).subscribe({
          next: () => {
            this.snackBar.open("Video eliminado con éxito", "Ok", { duration: 3000 });
            this.cargarVideos(); // Recargamos la lista
          },
          error: (err) => this.snackBar.open("Error al eliminar el video", "Cerrar", { duration: 5000 })
        });
      }
    });
  }
}
