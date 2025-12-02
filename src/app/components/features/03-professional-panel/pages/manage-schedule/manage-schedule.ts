import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfScheduleService } from '../../services/prof-schedule.service';
import { AuthService } from '../../../../core/services/auth';
import {ScheduleRequestDTO, ScheduleResponseDTO} from '../../../../core/models/schedule.dto';
import {catchError, forkJoin, interval, of, startWith, Subscription} from 'rxjs';
import {AppointmentService} from '../../../02-client-panel/services/appointment.service';
import {switchMap} from 'rxjs/operators';
import {addDays, format, startOfWeek} from 'date-fns';

@Component({
  selector: 'app-manage-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './manage-schedule.html',
  styleUrls: ['./manage-schedule.css']
})
export class ManageSchedule implements OnInit, OnDestroy {

  scheduleForm!: FormGroup;
  horas: { valor: string, fecha: Date }[] = [];
  horasTabla: number[] = [];
  diasSemana: any[] = [];

  citasOcupadas: Set<string> = new Set();
  misHorariosExistentes: ScheduleResponseDTO[] = [];

  // Variable para controlar la suscripción automática
  private updateSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private profScheduleService: ProfScheduleService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.generarHoras();
    this.calcularDiasSemanaActual();
  }

  ngOnInit(): void {
    console.log("Inicializando Gestión de Horarios...");

    this.scheduleForm = this.fb.group({
      lunes: this.crearGrupo(), martes: this.crearGrupo(), miercoles: this.crearGrupo(),
      jueves: this.crearGrupo(), viernes: this.crearGrupo()
    });

    // INICIAMOS LA ACTUALIZACIÓN AUTOMÁTICA
    this.iniciarAutoUpdate();
  }

  ngOnDestroy(): void {
    // Detenemos el reloj al salir
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  crearGrupo() {
    return this.fb.group({activo: [false], inicio: ['09:00:00'], fin: ['18:00:00']});
  }

  // --- LÓGICA DE AUTO-UPDATE ---
  iniciarAutoUpdate() {
    const profId = this.authService.getUserId() || 1;

    this.updateSubscription = interval(5000) // Cada 5 segundos
      .pipe(
        startWith(0), // Ejecutar ya
        switchMap(() => {
          return forkJoin({
            schedules: this.profScheduleService.getSchedulesByProfessionalId(Number(profId)),
            appointments: this.appointmentService.listAll()
          }).pipe(
            catchError(err => {
              console.warn("Error en auto-update:", err);
              return of(null); // No matar el intervalo si falla una vez
            })
          );
        })
      )
      .subscribe((resp) => {
        if (resp) {
          this.procesarDatos(resp.schedules, resp.appointments);
        }
      });
  }

  // Procesar datos recibidos (antes estaba dentro de cargarDatosCompletos)
  procesarDatos(schedules: any[], appointments: any[]) {
    this.misHorariosExistentes = schedules;
    this.citasOcupadas.clear();

    // 1. Detectar Ocupados
    appointments.forEach((app: any) => {
      const sId = app.scheduleId || app.schedule?.id;
      if (sId && app.statusId !== 4) {
        const original = schedules.find((s: any) => s.id === sId);
        if (original) {
          this.citasOcupadas.add(`${original.date} ${original.time_start}`);
        }
      }
    });

    // 2. Actualizar formulario (Solo si no se está editando activamente para no molestar al usuario)
    // Nota: Aquí podríamos decidir NO tocar el formulario si el usuario está escribiendo,
    // pero para simplificar, actualizaremos los switches si vienen datos nuevos.

    this.diasSemana.forEach(dia => {
      const fechaStr = format(dia.dateObj, 'yyyy-MM-dd');
      const horariosDia = schedules.filter((h: any) => h.date === fechaStr);

      if (horariosDia.length > 0) {
        horariosDia.sort((a: any, b: any) => a.time_start.localeCompare(b.time_start));
        const inicio = horariosDia[0].time_start;
        horariosDia.sort((a: any, b: any) => b.time_ends.localeCompare(a.time_ends));
        const fin = horariosDia[0].time_ends;

        const group = this.scheduleForm.get(dia.key);

        // Solo actualizamos si los valores son diferentes para evitar loops o bloqueos de UI
        if (group && !group.dirty) {
          group.patchValue({
            activo: true,
            inicio: this.normHora(inicio),
            fin: this.normHora(fin)
          }, {emitEvent: false});
        }
      }
    });

    this.cdr.detectChanges(); // Refrescar vista (colores rojos/verdes)
  }

  // --- GUARDADO ---
  GuardarCambios(): void {
    const profId = this.authService.getUserId() || 1;

    // Pausamos la actualización mientras guardamos
    if (this.updateSubscription) this.updateSubscription.unsubscribe();

    //  Construir el horario DESEADO basado en el formulario
    const horariosDeseados: Set<string> = new Set();

    this.diasSemana.forEach(diaInfo => {
      const group = this.scheduleForm.get(diaInfo.key);
      if (group && group.value.activo) {
        const fecha = format(diaInfo.dateObj, 'yyyy-MM-dd');
        const ini = parseInt(group.value.inicio.split(':')[0], 10);
        const fin = parseInt(group.value.fin.split(':')[0], 10);

        for (let h = ini; h < fin; h++) {
          const start = `${h < 10 ? '0'+h : h}:00:00`;
          horariosDeseados.add(`${fecha}|${start}`);
        }
      }
    });

    //  Identificar qué ELIMINAR (existen pero ya no están en el formulario)
    const horariosAEliminar = this.misHorariosExistentes.filter(existente => {
      const key = `${existente.date}|${existente.time_start}`;

      //  NO ELIMINAR si tiene una cita ocupada
      const estaOcupado = this.citasOcupadas.has(`${existente.date} ${existente.time_start}`);
      if (estaOcupado) {
        return false; // No lo eliminamos si hay cita
      }

      //  ELIMINAR si ya no está en el formulario
      return !horariosDeseados.has(key);
    });

    // Identificar qué CREAR (están en el formulario pero no existen)
    const horariosACrear: ScheduleRequestDTO[] = [];

    this.diasSemana.forEach(diaInfo => {
      const group = this.scheduleForm.get(diaInfo.key);
      if (group && group.value.activo) {
        const fecha = format(diaInfo.dateObj, 'yyyy-MM-dd');
        const ini = parseInt(group.value.inicio.split(':')[0], 10);
        const fin = parseInt(group.value.fin.split(':')[0], 10);

        for (let h = ini; h < fin; h++) {
          const start = `${h < 10 ? '0'+h : h}:00:00`;
          const end = `${(h+1) < 10 ? '0'+(h+1) : (h+1)}:00:00`;

          //  Solo crear si NO existe ya
          const yaExiste = this.misHorariosExistentes.some(existente =>
            existente.date === fecha && existente.time_start === start
          );

          if (!yaExiste) {
            horariosACrear.push({
              profesionalId: Number(profId),
              date: fecha,
              time_start: start,
              time_ends: end
            });
          }
        }
      }
    });

    //  Ejecutar ELIMINACIONES
    const deleteRequests = horariosAEliminar.map(horario =>
      this.profScheduleService.deleteSchedule(horario.id!).pipe(
        catchError(err => {
          console.error(`Error eliminando horario ${horario.id}:`, err);
          return of(null);
        })
      )
    );

    //  Ejecutar CREACIONES
    const createRequests = horariosACrear.map(horario =>
      this.profScheduleService.createSchedule(horario).pipe(
        catchError(err => {
          console.error('Error creando horario:', err);
          return of(null);
        })
      )
    );

    //  Ejecutar
    const allRequests = [...deleteRequests, ...createRequests];

    if (allRequests.length === 0) {
      this.snackBar.open('No hay cambios para guardar', 'Ok', { duration: 2000 });
      this.iniciarAutoUpdate();
      return;
    }

    forkJoin(allRequests).subscribe({
      next: (results) => {
        const eliminados = deleteRequests.length;
        const creados = createRequests.length;

        console.log(`✅ Eliminados: ${eliminados}, Creados: ${creados}`);

        this.snackBar.open(
          `¡Horario actualizado! (${eliminados} eliminados, ${creados} creados)`,
          'Ok',
          { duration: 4000 }
        );

        // Reiniciar auto-update
        this.iniciarAutoUpdate();
      },
      error: (err) => {
        console.error('Error guardando cambios:', err);
        this.snackBar.open('Error al guardar cambios', 'Cerrar', { duration: 3000 });
        this.iniciarAutoUpdate();
      }
    });
  }

  // --- VISUALES ---
  getEstadoVisual(diaKey: string, dateObj: Date, hora: number): string {
    const group = this.scheduleForm.get(diaKey);
    if (!group || !group.value.activo) return 'oculto';

    const ini = parseInt(group.value.inicio.split(':')[0], 10);
    const fin = parseInt(group.value.fin.split(':')[0], 10);

    if (hora < ini || hora >= fin) return 'oculto';

    const fechaStr = format(dateObj, 'yyyy-MM-dd');
    const horaStr = `${hora < 10 ? '0' + hora : hora}:00:00`;

    if (this.citasOcupadas.has(`${fechaStr} ${horaStr}`)) return 'ocupado';

    return 'disponible';
  }

  normHora(h: string) {
    return h.length === 5 ? h + ':00' : h;
  }

  generarHoras() {
    this.horas = [];
    this.horasTabla = [];
    const d = new Date();
    d.setMinutes(0);
    d.setSeconds(0);
    for (let i = 8; i <= 21; i++) {
      d.setHours(i);
      this.horas.push({valor: `${i < 10 ? '0' + i : i}:00:00`, fecha: new Date(d)});
      this.horasTabla.push(i);
    }
  }

  calcularDiasSemanaActual() {
    const start = startOfWeek(new Date(), {weekStartsOn: 1});
    const names = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    this.diasSemana = names.map((key, i) => ({
      key,
      label: format(addDays(start, i), 'EEEE d'),
      dateObj: addDays(start, i)
    }));
  }
}
