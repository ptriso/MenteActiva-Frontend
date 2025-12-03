import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RegisterClientDTO} from '../../../core/models/register-client.dto';
import {ClientResponseDTO} from '../../../core/models/client.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8080/upc/MenteActiva/Clients';

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get<ClientResponseDTO>(`${this.baseUrl}/listar/${id}`);
  }

  update(id: number, dto: RegisterClientDTO): Observable<RegisterClientDTO> {
    return this.http.put<RegisterClientDTO>(
      `${this.baseUrl}/modificar/${id}`,
      dto
    );
  }
}
