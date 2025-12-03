import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProfAppointmentsService} from '../../services/prof-appointments.service';

@Component({
  selector: 'app-appointments-summary',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './appointments-summary.html',
  styleUrl: './appointments-summary.css',
})
export class AppointmentsSummaryComponent implements OnInit {

  appointmentId!: number;
  summary: string | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private profApptService: ProfAppointmentsService
  ) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));

    this.profApptService.getSummary(this.appointmentId).subscribe({
      next: (data) => {
        this.summary = data?.conclusion || 'Esta cita no tiene conclusión registrada.';
        this.loading = false;
      },
      error: () => {
        this.summary = 'No existe una conclusión para esta cita.';
        this.loading = false;
      }
    });
  }
}
