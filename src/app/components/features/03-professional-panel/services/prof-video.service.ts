import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// (Usaremos el DTO de Video que ya creamos)
import { VideoResponseDTO, VideoRequestDTO } from '../../../core/models/video.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfVideoService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Videos';

  constructor(private http: HttpClient) { }

  /**
   * Llama a /listartodos [cite: 282]
   * (Idealmente, el backend debería tener un GET /profesional/{id})
   */
  getVideosByProfessionalId(profId: number): Observable<VideoResponseDTO[]> {
    // Por ahora, traemos todos y filtraremos en el frontend
    return this.http.get<VideoResponseDTO[]>(`${this.API_URL}/listartodos`);
  }

  /**
   * Llama a /registrar
   */
  createVideo(dto: VideoRequestDTO): Observable<VideoResponseDTO> {
    return this.http.post<VideoResponseDTO>(`${this.API_URL}/registrar`, dto);
  }

  /**
   * Llama a /eliminar/{id} [cite: 284]
   */
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/eliminar/${id}`);
  }

  /**
   * Llama a /VideosMasVistos [cite: 286]
   */
  getMostViewedVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/VideosMasVistos`);
  }
  updateVideo(id: number, dto: VideoRequestDTO): Observable<VideoResponseDTO> {
    return this.http.put<VideoResponseDTO>(`${this.API_URL}/modificar/${id}`, dto);
  }
  getVideoById(id: number): Observable<VideoResponseDTO> {
    throw new Error('Ruta getVideoById no implementada');
  }
}
