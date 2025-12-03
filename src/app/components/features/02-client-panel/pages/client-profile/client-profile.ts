import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {AuthService} from '../../../../core/services/auth';
import {ClientService} from '../../services/client.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RegisterClientDTO} from '../../../../core/models/register-client.dto';
import {ClientResponseDTO} from '../../../../core/models/client.dto';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.css',
})
export class ClientProfile  implements OnInit {
  form!: FormGroup;
  hasConsent: boolean | undefined;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      age: [{value: null, disabled: true}]
    });

    const profileId = this.authService.getProfileId();
    if (!profileId) {
      this.loading = false;
      return;
    }

    this.clientService.getById(profileId).subscribe({
      next: (c: ClientResponseDTO) => {
        this.form.patchValue({
          name: c.name,
          lastname: c.lastname,
          mail: c.mail,
          phone: c.phone,
          age: c.age
        });

        this.hasConsent = c.hasConsent;

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);

        if (err.status === 403) {
          this.snackBar.open('No tienes permisos para ver este perfil.', 'Cerrar', {
            duration: 4000
          });
        } else {
          this.snackBar.open('Error al cargar el perfil.', 'Cerrar', {
            duration: 4000
          });
        }

        this.loading = false;
      }
    });
  }
  get consentLabel(): string {
    const rawAge = this.form.get('age')?.value;
    const age = (rawAge === null || rawAge === undefined || rawAge === '')
      ? null
      : Number(rawAge);

    // 👉 Caso sin edad (N/D): NO queremos "Sin consentimiento — requerido"
    if (age === null) {
      return 'No disponible';
    }

    // 👉 Menor de edad
    if (age < 18) {
      return this.hasConsent
        ? 'Registrado (menor de edad)'
        : 'Sin consentimiento — requerido';
    }

    // 👉 Mayor de edad
    return this.hasConsent ? 'Registrado' : 'No registrado';
  }
  get consentClass(): string {
    const label = this.consentLabel;
    if (label.startsWith('Registrado')) return 'yes';
    if (label.startsWith('Sin consentimiento') || label.startsWith('No registrado')) return 'no';
    return ''; // No disponible
  }
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const profileId = this.authService.getProfileId();
    const userId = this.authService.getUserId();
    if (!profileId || !userId) {
      return;
    }

    const dto: RegisterClientDTO = {
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      mail: this.form.get('mail')?.value,
      phone: this.form.get('phone')?.value,
      age: this.form.get('age')?.value,
      userId: userId
    };

    this.clientService.update(profileId, dto).subscribe({
      next: () => {
        this.snackBar.open('Perfil actualizado correctamente', 'Ok', { duration: 4000 });
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.snackBar.open('Error al actualizar el perfil', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
