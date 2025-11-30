import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RegisterClientDTO} from '../../../core/models/register-client.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8080/upc/MenteActiva/Clients';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<RegisterClientDTO> {
    // 🔹 Necesitas que tu backend tenga GET /Clients/{id} que devuelva ClientResponseDTO
    return this.http.get<RegisterClientDTO>(`${this.baseUrl}/${id}`);
  }

  update(id: number, dto: RegisterClientDTO): Observable<RegisterClientDTO> {
    return this.http.put<RegisterClientDTO>(
      `${this.baseUrl}/modificar/${id}`,
      dto
    );
  }
}
