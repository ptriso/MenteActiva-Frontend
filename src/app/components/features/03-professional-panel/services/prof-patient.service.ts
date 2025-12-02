import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// (Necesitamos crear este DTO)
import { UserClientDTO } from '../../../core/models/user-client.dto';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfPatientService {

  // Apunta al UserController
  private API_URL = 'http://localhost:8080/upc/MenteActiva/Clients';

  constructor(private http: HttpClient) { }
  getPatients(professionalId: number): Observable<UserClientDTO[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };

    // Usamos TU RUTA nueva directamente
    const url = `${this.API_URL}/listByProfessional/${professionalId}`;

    console.log("Llamando a la API:", url);

    return this.http.get<UserClientDTO[]>(url, { headers }).pipe(
      tap(data => console.log("Datos recibidos de listByProfessional:", data))
    );
  }
}
