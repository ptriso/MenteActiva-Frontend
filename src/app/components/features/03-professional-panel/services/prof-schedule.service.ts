import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Usaremos el DTO de Schedule que ya creamos
import { ScheduleResponseDTO } from '../../../core/models/schedule.dto';

// (Necesitamos crear este DTO)
import { ScheduleRequestDTO } from '../../../core/models/schedule.dto';


@Injectable({
  providedIn: 'root'
})
export class ProfScheduleService {

  private API_URL = 'http://localhost:8080/upc/MenteActiva/Schedules';

  constructor(private http: HttpClient) { }

  /**
   * Llama a /registrar para crear un nuevo bloque de horario
   */
  createSchedule(dto: ScheduleRequestDTO): Observable<ScheduleResponseDTO> {
    return this.http.post<ScheduleResponseDTO>(`${this.API_URL}/registrar`, dto);
  }

  // (Aquí podemos añadir métodos para getMySchedules, update, delete, etc.)
}
