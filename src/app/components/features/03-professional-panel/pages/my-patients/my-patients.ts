import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'; // <-- Como tu profe

// Módulos y Servicios
import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfPatientService } from '../../services/prof-patient.service';
import { UserClientDTO } from '../../../../core/models/user-client.dto';

@Component({
  selector: 'app-my-patients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './my-patients.html',
  styleUrls: ['./my-patients.css']
})
export class MyPatients implements OnInit {

  // Lógica de MatTable (como tu profesor)
  dataSource = new MatTableDataSource<UserClientDTO>();
  displayedColumns: string[] = ['nombreCompleto', 'email', 'telefono', 'acciones'];

  constructor(
    private profPatientService: ProfPatientService
  ) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.profPatientService.getPatients().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error("Error al cargar pacientes:", err);
      }
    });
  }

  // Filtro de la tabla (como tu profesor)
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // (Aquí irá la lógica para ver el historial, etc.)
  verHistorial(clientId: number) {
    console.log("Ver historial del cliente", clientId);
  }
}
