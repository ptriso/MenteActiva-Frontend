import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VideoResponseDTO, VideoRequestDTO, MostViewedVideoDTO } from '../../../core/models/video.dto';

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

  createVideo(dto: VideoRequestDTO): Observable<VideoResponseDTO> {
    return this.http.post<VideoResponseDTO>(`${this.API_URL}/registrar`, dto);
  }

  updateVideo(id: number, dto: VideoRequestDTO): Observable<VideoResponseDTO> {
    return this.http.put<VideoResponseDTO>(`${this.API_URL}/modificar/${id}`, dto);
  }

  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/eliminar/${id}`);
  }

  getMostViewedVideos(): Observable<MostViewedVideoDTO[]> {
    return this.http.get<MostViewedVideoDTO[]>(`${this.API_URL}/VideosMasVistos`);
  }
}
