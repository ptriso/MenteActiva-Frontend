// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Nuestros Modelos
import { TokenDTO } from '../models/token.dto';
import { LoginDTO } from '../models/login.dto';
import { RegisterUserDTO } from '../models/register-user.dto';
import { RegisterClientDTO } from '../models/register-client.dto';
import { ConsentDTO } from '../models/consent.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva';

  constructor(private http: HttpClient) { }

  /**
   * Iniciar Sesión (UserController)
   */
  login(loginDto: LoginDTO): Observable<TokenDTO> {
    return this.http.post<TokenDTO>(`${this.API_URL}/User/login`, loginDto).pipe(
      tap((data: TokenDTO) => {
        localStorage.setItem('jwtToken', data.jwtToken);
        localStorage.setItem('user_id', data.id.toString());
        localStorage.setItem('authorities', data.authorities);

        if (data.profileId) {
          localStorage.setItem('profile_id', data.profileId.toString());
        }
        if (data.username) {
          localStorage.setItem('username', data.username);
        }
      })
    );
  }

  /**
   * Registrar el Usuario base (UserController)
   */
  registerUser(registerDto: RegisterUserDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/User/register`, registerDto);
  }

  /**
   * Registrar el Perfil de Cliente (ClientController)
   */
  registerClientProfile(clientDto: RegisterClientDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/Clients/registrar`, clientDto);
  }

  /**
   * Registrar el Consentimiento (ConsentsController)
   */
  registerConsent(consentDto: ConsentDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/Consents/registrar`, consentDto);
  }

  /**
   * Cerrar Sesión (Lógica de tu profesor)
   */
  logout(): void {
    localStorage.clear();
  }

  /**
   * ¿Está logueado?
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  /**
   * Obtiene los roles/authorities
   * Tu backend los separa por ";"
   */
  getAuthorities(): string[] {
    const raw = localStorage.getItem('authorities');
    if (!raw) return [];
    return raw
      .split(';')
      .map(r => r.trim())
      .filter(r => !!r);
  }

  /**
   * Obtiene el token
   */
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  /**
   * Obtiene el ID del usuario logueado desde localStorage.
   */
  getUserId(): number | null {
    const raw = localStorage.getItem('user_id');
    return raw ? Number(raw) : null;
  }
  getProfileId(): number | null {
    const raw = localStorage.getItem('profile_id');
    return raw ? Number(raw) : null;
  }
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

}
