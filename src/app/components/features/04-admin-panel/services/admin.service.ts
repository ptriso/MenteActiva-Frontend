import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// (Necesitaremos crear/actualizar estos DTOs)
import { UserResponseDTO } from '../../../core/models/user.dto';
import { AuthorityResponseDTO } from '../../../core/models/authority.dto';
import { UserAuthorityRequestDTO } from '../../../core/models/user-authority.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva';

  constructor(private http: HttpClient) { }

  /**
   * Llama a /User/listartodos
   */
  getUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.API_URL}/User/listartodos`);
  }

  /**
   * Llama a /Authority/listartodos
   */
  getRoles(): Observable<AuthorityResponseDTO[]> {
    return this.http.get<AuthorityResponseDTO[]>(`${this.API_URL}/Authority/listartodos`);
  }

  /**
   * Llama a /User_Authority/registrar
   * (¡NECESITO VERIFICAR ESTA LÓGICA!)
   * Asignar un rol nuevo a un usuario.
   */
  assignRole(dto: UserAuthorityRequestDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/User_Authority/registrar`, dto);
  }

  /**
   * Llama a /User_Authority/eliminar/{id}
   * (¡NECESITO VERIFICAR ESTA LÓGICA!)
   * Quitar un rol a un usuario.
   */
  removeRole(userAuthorityId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/User_Authority/eliminar/${userAuthorityId}`);
  }
}
