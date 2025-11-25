import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AppointmentRequestDTO,
  AppointmentResponseDTO
} from '../../../core/models/appointment.dto';
import {AppointmentClientDTO} from '../../../core/models/appointment-client.dto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Appointments';

  constructor(private http: HttpClient) { }

  /**
   * Llama a /registrar para crear una nueva cita
   */
  createAppointment(dto: AppointmentRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/registrar`, dto);
  }
  getAppointmentsByClientId(clientId: number) {
    return this.http.get<AppointmentClientDTO[]>(`${this.API_URL}/cliente/${clientId}`);
  }
  listAll(): Observable<AppointmentResponseDTO[]> {
    return this.http.get<AppointmentResponseDTO[]>(
      'http://localhost:8080/upc/MenteActiva/Appointments/listartodos'
    );
  }
  cancelAppointment(id: number) {
    return this.http.put<void>(`${this.API_URL}/cancelar/${id}`, {});
  }

}
