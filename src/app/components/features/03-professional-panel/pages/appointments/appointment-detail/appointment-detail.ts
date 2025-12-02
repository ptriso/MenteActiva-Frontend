import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MaterialModule} from '../../../../../shared/material/material.imports';
import {ProfAppointmentsService} from '../../../services/prof-appointments.service';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-prof-appointment-detail',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './appointment-detail.html'
})
export class ProfAppointmentDetail implements OnInit {

  appointmentId!: number;
  summary = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSrv: ProfAppointmentsService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id'));
  }

  save() {
    this.appSrv.saveSummary(this.appointmentId, this.summary).subscribe(() => {
      this.snack.open('Conclusión guardada', 'OK', { duration: 3000 });
      this.router.navigate(['/professional/appointments/upcoming']);
    });
  }
}
