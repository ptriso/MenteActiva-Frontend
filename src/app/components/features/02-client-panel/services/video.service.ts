import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// (Necesitamos crear este modelo en el siguiente paso)
import { VideoResponseDTO } from '../../../core/models/video.dto';


@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Videos';

  constructor(private http: HttpClient) { }

  /**
   * Llama a /listartodos [cite: 282]
   * (Usamos 'any' por ahora, luego lo cambiaremos por el DTO)
   */
  getVideos(): Observable<VideoResponseDTO[]> { // <-- Cambia any[]
    return this.http.get<VideoResponseDTO[]>(`${this.API_URL}/listartodos`); // <-- Cambia any[]
  }
}
