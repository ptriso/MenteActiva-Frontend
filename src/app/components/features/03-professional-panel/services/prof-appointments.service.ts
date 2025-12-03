import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppointmentProfessionalDTO} from '../../../core/models/appointment-professional.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfAppointmentsService {

  private baseUrl = 'http://localhost:8080/upc/MenteActiva';

  constructor(private http: HttpClient) {}

  getAppointmentsByProfessional(id: number): Observable<AppointmentProfessionalDTO[]> {
    return this.http.get<AppointmentProfessionalDTO[]>(`${this.baseUrl}/Appointments/profesional/${id}/citas`);
  }

  getUpcomingAppointments(id: number): Observable<AppointmentProfessionalDTO[]> {
    return this.http.get<AppointmentProfessionalDTO[]>(`${this.baseUrl}/Appointments/profesional/${id}/proximas`);
  }

  generateChat(appointmentId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/Chats/auto/${appointmentId}`, {});
  }

  saveSummary(appointmentId: number, conclusion: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/Session_Summaries/appointment/${appointmentId}`,
      { conclusion }
    );
  }

  getSummary(appointmentId: number): Observable<{ conclusion: string }> {
    return this.http.get<{ conclusion: string }>(
      `${this.baseUrl}/Session_Summaries/appointment/${appointmentId}`
    );
  }
  updateStatus(appointmentId: number, status: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/Appointments/${appointmentId}/status`,
      null,
      { params: { status } }
    );
  }
}
