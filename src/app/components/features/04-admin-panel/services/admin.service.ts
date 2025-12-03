import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserResponseDTO } from '../../../core/models/user.dto';
import { AuthorityResponseDTO } from '../../../core/models/authority.dto';
import {UserAuthorityRequestDTO, UserAuthorityResponseDTO} from '../../../core/models/user-authority.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.API_URL}/User/listartodos`);
  }

  getRoles(): Observable<AuthorityResponseDTO[]> {
    return this.http.get<AuthorityResponseDTO[]>(`${this.API_URL}/Authority/listartodos`);
  }

  getUserAuthorities(): Observable<UserAuthorityResponseDTO[]> {
    return this.http.get<UserAuthorityResponseDTO[]>(`${this.API_URL}/User_Authority/listartodos`);
  }

  assignRole(dto: UserAuthorityRequestDTO): Observable<UserAuthorityResponseDTO> {
    return this.http.post<UserAuthorityResponseDTO>(`${this.API_URL}/User_Authority/registrar`, dto);
  }

  deleteUserAuthority(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/User_Authority/eliminar/${id}`);
  }
}
