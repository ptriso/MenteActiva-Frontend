import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';
// Servicios
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../../../core/services/auth';

import {MaterialModule} from '../../../../shared/material/material.imports';
import {AppointmentClientDTO} from '../../../../core/models/appointment-client.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import {RouterModule} from '@angular/router';
import {ChatDialogComponent} from '../../../03-professional-panel/pages/appointments-chat-dialog/chat-dialog.component';
import {SummaryDialogComponent} from './summary-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ProfAppointmentsService} from '../../../03-professional-panel/services/prof-appointments.service';


interface AppointmentViewModel {
  id: number;
  professionalName: string;
  date: Date;
  dateLabel: string;
  timeLabel: string;
  statusLabel: string;
}

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './my-appointments.html',
  styleUrls: ['./my-appointments.css']
})
export class MyAppointments implements OnInit {

  loading = false;

  upcomingAppointments: AppointmentClientDTO[] = [];
  historyAppointments: AppointmentClientDTO[] = [];

  displayedColumnsUpcoming = ['professional','date','time','status','actions'];
  displayedColumnsHistory  = ['professional','date','time','status','historyActions'];

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private profApptService: ProfAppointmentsService
  ) {}

  ngOnInit(): void {
    const clientId = this.authService.getProfileId();

    if (clientId == null) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadAppointments(clientId); // ✅ ahora es number
  }
  // 🔹 Carga las citas del cliente
  private loadAppointments(clientId: number): void {
    this.loading = true;
    this.appointmentService.getAppointmentsByClientId(clientId).subscribe({
      next: (citas) => {
        this.loading = false;
        this.splitUpcomingAndHistory(citas);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar citas del cliente:', err);
      }
    });

    this.appointmentService.getAppointmentsByClientId(clientId).subscribe({
      next: (citas) => {
        this.loading = false;
        this.splitUpcomingAndHistory(citas);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar citas del cliente:', err);
      }
    });
  }

  // 🔹 Separa próximas vs historial
  private splitUpcomingAndHistory(citas: AppointmentClientDTO[]) {
    const now = new Date();

    this.upcomingAppointments = [];
    this.historyAppointments = [];

    citas.forEach(c => {
      const fechaHora = new Date(`${c.date}T${c.timeStart}`);
      const status = (c.status || '').toUpperCase();

      // Estados cerrados -> siempre historial
      const esCerrada =
        status === 'COMPLETADA' ||
        status === 'CANCELADA'  ||
        status === 'INASISTENCIA';

      if (esCerrada || fechaHora < now) {
        this.historyAppointments.push(c);
      } else {
        this.upcomingAppointments.push(c);
      }
    });
  }
  showChat(appointmentId: number): void {
    this.profApptService.generateChat(appointmentId).subscribe({
      next: (resp) => {
        this.dialog.open(ChatDialogComponent, {
          width: '500px',
          data: { chat: resp.mensaje }
        });
      },
      error: () => {
        this.snackBar.open(
          'No se pudo obtener el chat de esta cita.',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  showSummary(appointmentId: number): void {
    this.profApptService.getSummary(appointmentId).subscribe({
      next: (data) => {
        const text = data?.conclusion || 'Esta cita no tiene conclusión registrada.';

        this.dialog.open(SummaryDialogComponent, {
          width: '500px',
          data: { summary: text }
        });
      },
      error: () => {
        this.snackBar.open(
          'No se pudo obtener la conclusión de esta cita.',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
  cancelAppointment(app: AppointmentClientDTO): void {
    if (!confirm('¿Seguro que deseas cancelar esta cita?')) return;

    const clientId = this.authService.getProfileId();
    if (clientId == null) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.appointmentService.cancelAppointment(app.id).subscribe({
      next: () => {
        this.snackBar.open('Cita cancelada correctamente', 'Cerrar', {
          duration: 3000,
        });
        this.loadAppointments(clientId); // 👈 refrescamos la lista
      },
      error: (err) => {
        console.error('Error al cancelar la cita:', err);
        this.snackBar.open('No se pudo cancelar la cita', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
