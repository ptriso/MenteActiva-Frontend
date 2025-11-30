import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

// (Necesitamos crear este modelo en el siguiente paso)
import { ProfessionalResponseDTO } from '../../../core/models/professional.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Professionals';

  private profileSubject = new BehaviorSubject<any | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Llama a /listartodos [cite: 38]
   */
  getProfessionals(): Observable<ProfessionalResponseDTO[]> {
    return this.http.get<ProfessionalResponseDTO[]>(`${this.API_URL}/listartodos`);
  }
  getById(id: number): Observable<ProfessionalResponseDTO> {
    return this.http.get<ProfessionalResponseDTO>(`${this.API_URL}/listar/${id}`);
  }
  setCurrentProfile(profile: any): void {
    this.profileSubject.next(profile);
  }

  // (opcional) para leer sincrónicamente el último valor
  getCurrentProfile(): any | null {
    return this.profileSubject.value;
  }
}
