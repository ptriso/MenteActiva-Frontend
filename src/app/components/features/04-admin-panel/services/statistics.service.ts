import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MostViewedVideo {
  titulo: string;
  autor: string;
  totalVistas: number;
}

export interface TotalCitasPorProfesional {
  nombre: string;
  apellido: string;
  cantidadDeCitas: number;
}

export interface TopEspecialidad {
  specialization: string;
  totalCitas: number;
}

export interface TopProfesional {
  profesionalId: number;
  lastname: string;
  name: string;
  totalCitas: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private API_URL = 'http://localhost:8080/upc/MenteActiva';

  constructor(private http: HttpClient) { }

  getMostViewedVideos(): Observable<MostViewedVideo[]> {
    return this.http.get<MostViewedVideo[]>(`${this.API_URL}/Videos/VideosMasVistos`);
  }

  getCitasPorProfesional(): Observable<TotalCitasPorProfesional[]> {
    return this.http.get<TotalCitasPorProfesional[]>(`${this.API_URL}/Professionals/CitasPorProfesional`);
  }

  getTopEspecialidades(top: number = 5): Observable<TopEspecialidad[]> {
    return this.http.get<TopEspecialidad[]>(`${this.API_URL}/Appointments/ranking/top-especialidades?top=${top}`);
  }

  getTopProfesionales(top: number = 5): Observable<TopProfesional[]> {
    return this.http.get<TopProfesional[]>(`${this.API_URL}/Appointments/ranking/top-profesionales-todas?top=${top}`);
  }
}
