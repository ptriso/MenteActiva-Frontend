import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {VideoProgressDTO} from '../../../core/models/video-progress.dto';

export interface VideoProgressCreateDTO {
  clientId: number;
  videoId: number;
  percentage: number;
  current_time?: number;
  views_count?: number;
}
@Injectable({
  providedIn: 'root'
})
export class VideoProgressService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Video_Progress';

  constructor(private http: HttpClient) { }

  getAll(): Observable<VideoProgressDTO[]> {
    return this.http.get<VideoProgressDTO[]>(`${this.API_URL}/listartodos`);
  }

  // 🔹 NUEVO: solo los progresos del cliente actual
  getByClient(clientId: number): Observable<VideoProgressDTO[]> {
    return this.http.get<VideoProgressDTO[]>(`${this.API_URL}/cliente/${clientId}`);
  }

  // 🔹 NUEVO: registrar un progreso
  create(dto: VideoProgressCreateDTO): Observable<VideoProgressDTO> {
    return this.http.post<VideoProgressDTO>(`${this.API_URL}/registrar`, dto);
  }
}

