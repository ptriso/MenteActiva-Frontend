// my-appointments.ts (ACTUALIZADO)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

// Servicios
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../../../core/services/auth';
import { ProfAppointmentsService } from '../../../03-professional-panel/services/prof-appointments.service';

// Componentes
import { MaterialModule } from '../../../../shared/material/material.imports';
import { ChatDialogComponent } from '../../../03-professional-panel/pages/appointments-chat-dialog/chat-dialog.component';
import { SummaryDialogComponent } from './summary-dialog.component';
import { SharedHistoryDialogComponent } from './shared-history-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component'; // 👈 NUEVO

// Modelos
import { AppointmentClientDTO } from '../../../../core/models/appointment-client.dto';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './my-appointments.html',
  styleUrls: ['./my-appointments.css']
})
export class MyAppointments implements OnInit {

  loading = false;

  upcomingAppointments: AppointmentClientDTO[] = [];
  historyAppointments: AppointmentClientDTO[] = [];
  allAppointments: AppointmentClientDTO[] = []; // 👈 NUEVO: guardamos todas las citas

  displayedColumnsUpcoming = ['professional', 'date', 'time', 'status', 'actions'];
  displayedColumnsHistory = ['professional', 'date', 'time', 'status', 'historyActions'];

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

    this.loadAppointments(clientId);
  }

  // 🔹 Carga las citas del cliente
  private loadAppointments(clientId: number): void {
    this.loading = true;
    this.appointmentService.getAppointmentsByClientId(clientId).subscribe({
      next: (citas) => {
        this.loading = false;
        this.allAppointments = citas; // 👈 NUEVO: guardamos todas las citas
        this.splitUpcomingAndHistory(citas);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar citas del cliente:', err);
        this.snackBar.open('Error al cargar tus citas', 'Cerrar', { duration: 3000 });
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

      const esCerrada =
        status === 'COMPLETADA' ||
        status === 'CANCELADA' ||
        status === 'INASISTENCIA';

      if (esCerrada || fechaHora < now) {
        this.historyAppointments.push(c);
      } else {
        this.upcomingAppointments.push(c);
      }
    });

    // Ordenar: próximas por fecha ASC, historial por fecha DESC
    this.upcomingAppointments.sort((a, b) =>
      new Date(`${a.date}T${a.timeStart}`).getTime() - new Date(`${b.date}T${b.timeStart}`).getTime()
    );

    this.historyAppointments.sort((a, b) =>
      new Date(`${b.date}T${b.timeStart}`).getTime() - new Date(`${a.date}T${a.timeStart}`).getTime()
    );
  }

  // 🎨 Helpers de visualización
  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status?.toUpperCase()) {
      case 'COMPLETADA':
        return 'primary';
      case 'CONFIRMADA':
      case 'PROGRAMADA':
        return 'accent';
      case 'CANCELADA':
      case 'INASISTENCIA':
        return 'warn';
      default:
        return 'accent';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'COMPLETADA':
        return '✅';
      case 'CONFIRMADA':
        return '📅';
      case 'PROGRAMADA':
        return '🕒';
      case 'CANCELADA':
        return '❌';
      case 'INASISTENCIA':
        return '⚠️';
      default:
        return '📋';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-PE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isToday(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  }

  // 🔹 Ver chat de la cita
  showChat(appointmentId: number): void {
    this.profApptService.generateChat(appointmentId).subscribe({
      next: (resp) => {
        this.dialog.open(ChatDialogComponent, {
          width: '600px',
          maxHeight: '80vh',
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

  // 🔹 Ver conclusión de la cita
  showSummary(appointmentId: number): void {
    this.profApptService.getSummary(appointmentId).subscribe({
      next: (data) => {
        const text = data?.conclusion || 'Esta cita no tiene conclusión registrada.';

        this.dialog.open(SummaryDialogComponent, {
          width: '600px',
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

  // 🆕 Ver historial compartido con un profesional específico
  showSharedHistory(appointment: AppointmentClientDTO): void {
    const professionalId = appointment.professionalId;
    const professionalName = `${appointment.professionalName} ${appointment.professionalLastname}`;

    // Filtrar todas las citas con este profesional
    const sharedAppointments = this.allAppointments.filter(
      appt => appt.professionalId === professionalId
    );

    this.dialog.open(SharedHistoryDialogComponent, {
      width: '700px',
      maxHeight: '80vh',
      data: {
        appointments: sharedAppointments,
        professionalName: professionalName
      }
    });
  }

  // 🔹 Cancelar cita
  cancelAppointment(app: AppointmentClientDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmar Cancelación',
        message: `¿Estás seguro de cancelar la cita con ${app.professionalName} ${app.professionalLastname} el ${this.formatDate(app.date)} a las ${app.timeStart.slice(0, 5)}?`,
        confirmText: 'Sí, cancelar cita',
        cancelText: 'No, volver'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.executeCancellation(app);
      }
    });
  }

  private executeCancellation(app: AppointmentClientDTO): void {
    const clientId = this.authService.getProfileId();
    if (clientId == null) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.appointmentService.cancelAppointment(app.id).subscribe({
      next: () => {
        this.snackBar.open('✅ Cita cancelada correctamente', 'Cerrar', {
          duration: 3000,
        });
        this.loadAppointments(clientId);
      },
      error: (err) => {
        console.error('Error al cancelar la cita:', err);
        this.snackBar.open('❌ No se pudo cancelar la cita', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
}
