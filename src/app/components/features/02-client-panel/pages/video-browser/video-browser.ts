import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Nuestros Módulos y Servicios
import { MaterialModule } from '../../../../shared/material/material.imports';
import { VideoService } from '../../services/video.service';
import { VideoResponseDTO } from '../../../../core/models/video.dto';

@Component({
  selector: 'app-video-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './video-browser.html',
  styleUrls: ['./video-browser.css']
})
export class VideoBrowser implements OnInit {

  videos: VideoResponseDTO[] = [];

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.cargarVideos();
  }

  cargarVideos(): void {
    this.videoService.getVideos().subscribe({
      next: (data) => {
        this.videos = data;
      },
      error: (err) => {
        console.error("Error al cargar videos:", err);
        // (Aquí podrías usar MatSnackBar)
      }
    });
  }

  getDurationInMinutes(duration: number): number {
    const seconds = Number(duration);
    if (isNaN(seconds)) return 0;
    return Math.floor(seconds / 60); // solo minutos enteros
  }
}
