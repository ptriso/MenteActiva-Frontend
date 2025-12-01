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

  getVideosByProfessionalId(profId: number): Observable<VideoResponseDTO[]> {
    const t = new Date().getTime();
    return this.http.get<VideoResponseDTO[]>(`${this.API_URL}/profesional/${profId}?t=${t}`);
  }

  // 2. Crear video (POST)
  createVideo(dto: VideoRequestDTO): Observable<VideoResponseDTO> {
    return this.http.post<VideoResponseDTO>(`${this.API_URL}/registrar`, dto);
  }

  // 3. Actualizar video (PUT)
  updateVideo(id: number, dto: VideoRequestDTO): Observable<VideoResponseDTO> {
    return this.http.put<VideoResponseDTO>(`${this.API_URL}/modificar/${id}`, dto);
  }

  // 4. Eliminar (DELETE)
  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/eliminar/${id}`);
  }

  getMostViewedVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/VideosMasVistos`);
  }
}
