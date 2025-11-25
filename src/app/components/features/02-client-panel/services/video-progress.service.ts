import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoProgressService {

  // Apunta a tu controlador existente
  private API_URL = 'http://localhost:8080/upc/MenteActiva/Video_Progress';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/listartodos`);
  }
}
