import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { ScheduleService } from '../../services/schedule.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../../../core/services/auth';

import { ScheduleResponseDTO } from '../../../../core/models/schedule.dto';
import {AppointmentRequestDTO, AppointmentResponseDTO} from '../../../../core/models/appointment.dto';
import { ConfirmAppointmentDialogComponent } from '../../../../shared/components/confirm-appointment-dialog/confirm-appointment-dialog';

import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import {ProfessionalService} from '../../services/professional.service';

@Component({
  selector: 'app-schedule-picker',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule],
  templateUrl: './schedule-picker.html',
  styleUrls: ['./schedule-picker.css'],
})
export class SchedulePicker implements OnInit {
  format = format;

  professionalId: number = 0;
  clientId!: number
  professionalName: string = '';

  allProfessionalSchedules: ScheduleResponseDTO[] = [];

  scheduleGrid: {
    [time: string]: { [day: string]: ScheduleResponseDTO | null };
  } = {};

  currentWeekStart: Date = new Date();
  weekDays: Date[] = [];
  timeSlots: string[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private appointmentService: AppointmentService,
    private professionalService: ProfessionalService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  private isSchedulePast(sched: ScheduleResponseDTO): boolean {
    const start = new Date(`${sched.date}T${sched.time_start}`);
    const now = new Date();
    return start <= now;
  }
  ngOnInit(): void {
    const profileId = this.authService.getProfileId();

    if (profileId == null) {
      this.snackBar.open('Debes iniciar sesión como cliente para agendar citas.', 'Cerrar', {
        duration: 4000,
      });
      this.router.navigate(['/auth/login']);
      return;
    }

    this.clientId = profileId;

    this.route.paramMap.subscribe(params => {
      this.professionalId = Number(params.get('id'));

      if (this.professionalId) {
        this.cargarProfesional(this.professionalId);
      }

      this.currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      this.generateTimeSlots();
      this.cargarHorariosYCitas();
    });
  }

  cargarProfesional(id: number): void {
    this.professionalService.getById(id).subscribe({
      next: (prof) => {
        this.professionalName = `${prof.name} ${prof.lastname ?? ''}`.trim();
      },
      error: (err) => {
        console.error('Error al cargar profesional', err);
        this.professionalName = 'Profesional';
      }
    });
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    for (let hour = 8; hour <= 21; hour++) {
      this.timeSlots.push(format(new Date().setHours(hour, 0, 0, 0), 'HH:mm'));
    }
  }

  generateWeekDays(startDay: Date): void {
    this.weekDays = [];
    for (let i = 0; i < 5; i++) {
      this.weekDays.push(addDays(startDay, i));
    }
  }

  cargarHorariosYCitas(): void {

    const schedules$ = this.scheduleService.getSchedulesByProfessionalId(
      this.professionalId
    );

    const appointments$ = this.appointmentService.listAll();

    forkJoin({
      schedules: schedules$,
      appointments: appointments$,
    }).subscribe({
      next: ({
               schedules,
               appointments,
             }: {
        schedules: ScheduleResponseDTO[];
        appointments: AppointmentResponseDTO[];
      }) => {

        const occupiedScheduleIds = new Set<number>();

        const ID_CANCELADA = 4;
        appointments
          .filter(app => app.statusId !== ID_CANCELADA)
          .forEach(app => {
            if (app.scheduleId != null) {
              occupiedScheduleIds.add(app.scheduleId);
            } else if ((app as any).schedule?.id != null) {
              occupiedScheduleIds.add((app as any).schedule.id);
            }
          });

        this.allProfessionalSchedules = schedules.map((sched) => {
          const dateObj = new Date(`${sched.date}T${sched.time_start}`);
          return {
            ...sched,
            dateObject: dateObj,
            isOccupied: occupiedScheduleIds.has(sched.id),
            isPast: this.isSchedulePast(sched)
          };
        });

        this.generateWeekDays(this.currentWeekStart);
        this.buildScheduleGrid();
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.snackBar.open('Error al cargar horarios y citas.', 'Cerrar', {
          duration: 4000,
        });
      },
    });
  }

  buildScheduleGrid(): void {
    this.scheduleGrid = {};

    this.timeSlots.forEach((time) => {
      this.scheduleGrid[time] = {};
      this.weekDays.forEach((day) => {
        const dayKey = format(day, 'yyyy-MM-dd');
        this.scheduleGrid[time][dayKey] = null;
      });
    });

    this.allProfessionalSchedules.forEach((sched) => {
      if (!sched.dateObject) return;

      const scheduleDate = sched.dateObject;
      const scheduleTime = format(scheduleDate, 'HH:mm');
      const scheduleDay = format(scheduleDate, 'yyyy-MM-dd');

      if (this.weekDays.some((day) => isSameDay(day, scheduleDate))) {
        if (this.scheduleGrid[scheduleTime]) {
          this.scheduleGrid[scheduleTime][scheduleDay] = sched;
        }
      }
    });
  }

  changeWeek(direction: 'prev' | 'next'): void {
    this.currentWeekStart =
      direction === 'prev'
        ? addDays(this.currentWeekStart, -7)
        : addDays(this.currentWeekStart, 7);

    this.generateWeekDays(this.currentWeekStart);
    this.buildScheduleGrid();
  }

  getSlotClass(schedule: ScheduleResponseDTO | null): string {
    if (!schedule) return 'slot-not-available';
    if (schedule.isPast) return 'slot-past';
    return schedule.isOccupied ? 'slot-occupied' : 'slot-available';
  }

  isSlotClickable(schedule: ScheduleResponseDTO | null): boolean {
    return !!schedule && !schedule.isOccupied && !schedule.isPast;
  }

  agendarCita(schedule: ScheduleResponseDTO | null): void {
    if (!this.isSlotClickable(schedule)) return;

    const dialogRef = this.dialog.open(ConfirmAppointmentDialogComponent, {
      width: '400px',
      data: {
        schedule: {
          ...schedule,
          dateObject: new Date(`${schedule!.date}T${schedule!.time_start}`),
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.crearCita(schedule!.id);
      }
    });
  }

  crearCita(scheduleId: number): void {
    if (this.clientId == null) {
      this.snackBar.open(
        'Error: No se pudo verificar tu perfil de cliente. Inicia sesión nuevamente.',
        'Cerrar',
        { duration: 5000 }
      );
      this.router.navigate(['/auth/login']);
      return;
    }

    const appointmentDto: AppointmentRequestDTO = {
      clientId: this.clientId,
      statusId: 1,
      scheduleId,
    };

    this.appointmentService.createAppointment(appointmentDto).subscribe({
      next: () => {
        this.snackBar.open('¡Cita agendada exitosamente!', 'Ok', {
          duration: 3000,
        });
        this.cargarHorariosYCitas();
      },
      error: (err) => {
        console.error('Error al agendar la cita:', err);
        const status = err.status ?? err.error?.status;

        if (status === 409) {
          this.snackBar.open(
            'El horario ya fue reservado por otro usuario.',
            'Cerrar',
            { duration: 4000 }
          );
          this.cargarHorariosYCitas();
        } else {
          this.snackBar.open(
            'Error: No se pudo agendar la cita.',
            'Cerrar',
            { duration: 5000 }
          );
        }
      },
    });
  }

  formatDayOfWeek(date: Date): string {
    return format(date, 'EEE', { locale: es });
  }

  formatFullDate(date: Date): string {
    return format(date, 'dd/MM', { locale: es });
  }
}

