import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Router, RouterModule} from '@angular/router';
import {MaterialModule} from '../../../../../shared/material/material.imports';
import {ProfAppointmentsService} from '../../../services/prof-appointments.service';
import {AuthService} from '../../../../../core/services/auth';
import {AppointmentProfessionalDTO} from '../../../../../core/models/appointment-professional.dto';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {SummaryDialogComponent} from '../../appointments-summary/summary-dialog.component';



@Component({
  selector: 'app-prof-upcoming-appointments',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './appointments-upcoming.html',
})
export class ProfUpcomingAppointments implements OnInit {

  appointments: AppointmentProfessionalDTO[] = [];
  loading = false;

  statusOptions = [
    'PROGRAMADA',
    'CONFIRMADA',
    'COMPLETADA',
    'CANCELADA',
    'INASISTENCIA'
  ];

  constructor(
    private profApptService: ProfAppointmentsService,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const profId = this.auth.getProfileId();
    if (!profId) return;

    this.loading = true;
    this.profApptService.getUpcomingAppointments(profId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('No se pudieron cargar las próximas citas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  goToAll(): void {
    this.router.navigate(['/profesional/appointments']);
  }

  onStatusChange(a: AppointmentProfessionalDTO): void {
    this.profApptService.updateStatus(a.id, a.status).subscribe({
      next: () => {
        this.snackBar.open('Estado de la cita actualizado', 'Cerrar', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('No se pudo actualizar el estado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openSummaryDialog(a: AppointmentProfessionalDTO): void {
    const ref = this.dialog.open(SummaryDialogComponent, {
      width: '520px',
      data: { appointmentId: a.id }
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.snackBar.open('Conclusión registrada para la cita', 'Cerrar', {
          duration: 2500
        });

        this.appointments = this.appointments.filter(ap => ap.id !== a.id);
      }
    });
  }
}
