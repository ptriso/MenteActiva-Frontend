import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Router, RouterModule} from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import {ProfAppointmentsService} from '../../../services/prof-appointments.service';
import {MaterialModule} from '../../../../../shared/material/material.imports';
import {AuthService} from '../../../../../core/services/auth';
import { MatDialog } from '@angular/material/dialog';
import { ChatDialogComponent} from '../../appointments-chat-dialog/chat-dialog.component';
import {AppointmentProfessionalDTO} from '../../../../../core/models/appointment-professional.dto';


@Component({
  selector: 'app-prof-appointments-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './appointments-list.html',
  styleUrls: ['./appointments-list.css']
})
export class ProfAppointmentsList implements OnInit {

  appointments: AppointmentProfessionalDTO[] = [];
  loading = false;

  displayedColumns = ['client', 'date', 'time', 'actions'];

  // 🔵 AQUÍ DEFINIMOS LAS PROPIEDADES QUE TE FALTABAN
  constructor(
    public profApptService: ProfAppointmentsService,
    public auth: AuthService,
    public dialog: MatDialog,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const profId = this.auth.getProfileId();

    if (!profId) return;

    this.loading = true;

    this.profApptService.getAppointmentsByProfessional(profId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // 🔵 MOSTRAR EL CHAT GENERADO
  showChat(appointmentId: number): void {
    this.profApptService.generateChat(appointmentId).subscribe({
      next: (resp) => {
        this.dialog.open(ChatDialogComponent, {
          width: '500px',
          data: { chat: resp.mensaje }
        });
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'No se pudo generar el chat',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
  goToUpcoming(): void {
    this.router.navigate(['/profesional/appointments-upcoming']);
  }
  // 🔵 IR A LA PANTALLA DE CONCLUSIONES
  goToSummary(appointmentId: number): void {
    this.router.navigate(['/profesional/appointments-summary', appointmentId ]);
  }

}
