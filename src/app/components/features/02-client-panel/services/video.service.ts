import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VideoResponseDTO } from '../../../core/models/video.dto';

export interface VideoDTO {
  id: number;
  title: string;
  description: string;
  url: string;
  duration: number;
  professionalId: number;
  professionalName: string;
}
@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Videos';

  constructor(private http: HttpClient) { }

  getVideos(): Observable<VideoResponseDTO[]> {
    return this.http.get<VideoResponseDTO[]>(`${this.API_URL}/listartodos`);
  }
  listAll(): Observable<VideoDTO[]> {
    return this.http.get<VideoDTO[]>(`${this.API_URL}/listartodos`);
  }
}
