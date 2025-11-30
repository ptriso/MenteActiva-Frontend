import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  private baseUrl = 'http://localhost:8080/upc/MenteActiva/Professionals';

  private profileSubject = new BehaviorSubject<any | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<any> {
    // tu backend tiene algo tipo GET /Professionals/listar/{id}
    return this.http.get<any>(`${this.baseUrl}/listar/${id}`);
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/modificar/${id}`, dto);
  }
  setCurrentProfile(profile: any): void {
    this.profileSubject.next(profile);
  }

  // (opcional) para leer sincrónicamente el último valor
  getCurrentProfile(): any | null {
    return this.profileSubject.value;
  }
}
