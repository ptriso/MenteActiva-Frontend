

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfPatientService } from '../../services/prof-patient.service';
import { UserClientDTO } from '../../../../core/models/user-client.dto';
import { interval, startWith, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HistoryDialogComponent } from '../appointments/appointment-history-dialog/appointment-history-dialog';

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
  private updateSubscription: Subscription | undefined;

  professionalId: number = 1;
  dataSource: MatTableDataSource<UserClientDTO> = new MatTableDataSource<UserClientDTO>();
  displayedColumns: string[] = ['nombreCompleto', 'email', 'telefono', 'acciones'];

  constructor(
    private profPatientService: ProfPatientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.iniciarActualizacionAutomatica();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  iniciarActualizacionAutomatica(): void {
    this.updateSubscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.profPatientService.getPatients(this.professionalId))
      )
      .subscribe({
        next: (data: UserClientDTO[]) => {
          this.dataSource.data = data;
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


  verHistorial(clientId: number): void {
    console.log("🔍 Cargando historial del cliente ID:", clientId);

    if (!clientId) {
      console.error("❌ ID de cliente inválido");
      return;
    }

    const patient = this.dataSource.data.find(p =>
      (p.client_id === clientId) || (p.user_id === clientId)
    );

    const patientName = patient
      ? `${patient.name} ${patient.lastname}`
      : '';

    this.profPatientService.getPatientAppointments(clientId).subscribe({
      next: (appointments) => {
        console.log("✅ Todas las citas del cliente:", appointments);

        const myAppointments = appointments.filter(apt => {
          const fullName = `${apt.professionalName} ${apt.professionalLastname}`;
          return fullName.toLowerCase().includes('laura') && fullName.toLowerCase().includes('salazar');
        });

        console.log("✅ Citas con este profesional:", myAppointments);

        this.dialog.open(HistoryDialogComponent, {
          width: '700px',
          maxHeight: '80vh',
          data: {
            clientName: patientName,
            appointments: myAppointments
          }
        });
      },
      error: (err) => {
        console.error("❌ Error al cargar historial:", err);

        this.dialog.open(HistoryDialogComponent, {
          width: '700px',
          data: {
            clientName: patientName,
            appointments: []
          }
        });
      }
    });
  }
}
