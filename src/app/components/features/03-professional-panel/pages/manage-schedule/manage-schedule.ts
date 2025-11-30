import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfScheduleService } from '../../services/prof-schedule.service';
import { AuthService } from '../../../../core/services/auth';
import { ScheduleRequestDTO } from '../../../../core/models/schedule.dto';

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
export class ManageSchedule implements OnInit {

  scheduleForm!: FormGroup;
  // Generamos las horas para los <select>
  horas: string[] = this.generarHoras();

  constructor(
    private fb: FormBuilder,
    private profScheduleService: ProfScheduleService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      lunes: this.crearGrupoDia(true, '15:00:00', '19:00:00'),
      martes: this.crearGrupoDia(true, '15:00:00', '19:00:00'),
      miercoles: this.crearGrupoDia(true, '15:00:00', '19:00:00'),
      jueves: this.crearGrupoDia(false, '09:00:00', '13:00:00'),
      viernes: this.crearGrupoDia(true, '15:00:00', '19:00:00'),
      sabado: this.crearGrupoDia(false, '09:00:00', '13:00:00'),
      domingo: this.crearGrupoDia(false, '09:00:00', '13:00:00'),
    });
  }

  // Helper para crear el sub-formulario de cada día
  crearGrupoDia(activo: boolean, inicio: string, fin: string) {
    return this.fb.group({
      activo: [activo],
      inicio: [inicio],
      fin: [fin]
    });
  }

  // Helper para generar la lista de horas
  generarHoras(): string[] {
    const horas = [];
    for (let i = 8; i <= 20; i++) {
      const hora = i < 10 ? `0${i}` : `${i}`;
      horas.push(`${hora}:00:00`);
    }
    return horas;
  }

  /**
   * Lógica para guardar los cambios
   */
  GuardarCambios(): void {
    console.log("Guardando cambios...", this.scheduleForm.value);
    // (Aquí iría la lógica para procesar el formulario)

    // 1. Obtener el ID del profesional logueado
    const profId = this.authService.getUserId(); // (Asumimos que el ID de User es el ID de Profesional)
    if (profId == null) {
      this.snackBar.open(
        'Error: No se pudo identificar al profesional. Inicia sesión nuevamente.',
        'Cerrar',
        { duration: 4000 }
      );
      return;
    }

    // 2. Recorrer el formulario
    const formValue = this.scheduleForm.value;
    const dias = Object.keys(formValue); // ['lunes', 'martes', ...]

    // TODO: Esta lógica es compleja. Por ahora, solo guardamos el Lunes
    // (En el futuro, deberíamos iterar y generar los 'schedules' para las próximas 4 semanas)

    if (formValue.lunes.activo) {
      const lunesDTO: ScheduleRequestDTO = {
        profesional_id: profId,
        date: '2025-11-17', // (Simulamos el próximo lunes)
        time_start: formValue.lunes.inicio,
        time_ends: formValue.lunes.fin,
      };

      // 3. Llamar al servicio
      this.profScheduleService.createSchedule(lunesDTO).subscribe({
        next: () => {
          // 4. Mostrar el modal de confirmación (usaremos MatDialog)
          this.snackBar.open("¡Horario guardado con éxito!", "Ok", { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open("Error al guardar el horario", "Cerrar", { duration: 5000 });
          console.error(err);
        }
      });
    }
  }
}
