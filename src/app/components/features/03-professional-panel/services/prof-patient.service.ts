import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { UserClientDTO } from '../../../core/models/user-client.dto';
import {tap} from 'rxjs/operators';
import { AppointmentClientDTO } from '../../../core/models/appointment-client.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfPatientService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva';

  constructor(private http: HttpClient) { }
  getPatients(professionalId: number): Observable<UserClientDTO[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };

    const url = `${this.API_URL}/Clients/listByProfessional/${professionalId}`;

    console.log("Llamando a la API:", url);

    return this.http.get<UserClientDTO[]>(url, { headers }).pipe(
      tap(data => console.log("Datos recibidos de listByProfessional:", data))
    );
  }

  getPatientAppointments(clientId: number): Observable<AppointmentClientDTO[]> {
    const url = `${this.API_URL}/Appointments/cliente/${clientId}`;
    return this.http.get<AppointmentClientDTO[]>(url);
  }

}
