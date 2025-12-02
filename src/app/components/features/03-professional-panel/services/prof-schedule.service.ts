import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { ScheduleResponseDTO } from '../../../core/models/schedule.dto';
import { ScheduleRequestDTO } from '../../../core/models/schedule.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfScheduleService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Schedules';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createSchedule(schedule: ScheduleRequestDTO): Observable<ScheduleResponseDTO> {
    return this.http.post<ScheduleResponseDTO>(
      `${this.API_URL}/registrar`,
      schedule,
      { headers: this.getHeaders() }
    );
  }

  getSchedulesByProfessionalId(profId: number): Observable<ScheduleResponseDTO[]> {
    return this.http.get<ScheduleResponseDTO[]>(
      `${this.API_URL}/profesional/${profId}`,
      { headers: this.getHeaders() }
    );
  }

  deleteSchedule(scheduleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/eliminar/${scheduleId}`,
      { headers: this.getHeaders() }
    );
  }
}
