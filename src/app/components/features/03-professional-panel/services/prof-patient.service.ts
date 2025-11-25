import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// (Necesitamos crear este DTO)
import { UserClientDTO } from '../../../core/models/user-client.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfPatientService {

  // Apunta al UserController
  private API_URL = 'http://localhost:8080/upc/MenteActiva/User';

  constructor(private http: HttpClient) { }

  /**
   * Llama a /UsuariosClientes
   */
  getPatients(): Observable<UserClientDTO[]> {
    return this.http.get<UserClientDTO[]>(`${this.API_URL}/UsuariosClientes`);
  }
}
