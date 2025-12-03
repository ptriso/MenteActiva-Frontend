import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ScheduleResponseDTO } from '../../../core/models/schedule.dto';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Schedules';

  constructor(private http: HttpClient) { }

  getSchedules(): Observable<ScheduleResponseDTO[]> {
    return this.http.get<ScheduleResponseDTO[]>(`${this.API_URL}/listartodos`);
  }

  getSchedulesByProfessionalId(id: number): Observable<ScheduleResponseDTO[]> {
    return this.http.get<ScheduleResponseDTO[]>(`${this.API_URL}/profesional/${id}`);
  }
}
