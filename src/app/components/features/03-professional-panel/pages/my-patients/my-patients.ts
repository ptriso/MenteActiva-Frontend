import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'; // <-- Como tu profe

// Módulos y Servicios
import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfPatientService } from '../../services/prof-patient.service';
import { UserClientDTO } from '../../../../core/models/user-client.dto';
import {interval, startWith, Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';

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
export class MyPatients implements OnInit, OnDestroy {
  // Variable para guardar la suscripción y poder cancelarla al salir de la página
  private updateSubscription: Subscription | undefined;

  professionalId: number = 1; // Tu ID de prueba
  dataSource: MatTableDataSource<UserClientDTO> = new MatTableDataSource<UserClientDTO>();
  displayedColumns: string[] = ['nombreCompleto', 'email', 'telefono', 'acciones'];

  constructor(private profPatientService: ProfPatientService) {}

  ngOnInit(): void {
    this.iniciarActualizacionAutomatica();
  }

  // Se ejecuta cuando el usuario sale de esta pantalla (para apagar el "reloj" y no gastar memoria)
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  iniciarActualizacionAutomatica(): void {
    // 1. interval(5000) -> Ejecuta cada 5000ms (5 segundos)
    // 2. startWith(0) -> Ejecuta una vez INMEDIATAMENTE al entrar (no espera los primeros 5 seg)
    // 3. switchMap -> Cancela la petición anterior si tarda mucho y lanza la nueva

    this.updateSubscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.profPatientService.getPatients(this.professionalId))
      )
      .subscribe({
        next: (data: UserClientDTO[]) => {
          // Actualizamos los datos de la tabla
          this.dataSource.data = data;

          // Opcional: Solo para ver en consola que está funcionando
          // console.log("Tabla actualizada automáticamente:", new Date().toLocaleTimeString());
        },
        error: (err: any) => {
          console.error("Error actualizando pacientes:", err);
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verHistorial(clientId: number) {
    console.log("Ver historial del cliente", clientId);
  }
}
