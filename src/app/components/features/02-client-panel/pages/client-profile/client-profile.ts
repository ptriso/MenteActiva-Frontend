import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {AuthService} from '../../../../core/services/auth';
import {ClientService} from '../../services/client.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RegisterClientDTO} from '../../../../core/models/register-client.dto';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './client-profile.html',
  styleUrl: './client-profile.css',
})
export class ClientProfile  implements OnInit {
  form!: FormGroup;
  hasConsent: boolean | null = null; // luego lo conectas con backend
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
    });

    const profileId = this.authService.getProfileId();
    if (!profileId) {
      this.loading = false;
      return;
    }

    this.clientService.getById(profileId).subscribe({
      next: (c: RegisterClientDTO) => {
        this.form.patchValue({
          name: c.name,
          lastname: c.lastname,
          mail: c.mail,
          phone: c.phone,
        });

        // 🔹 Aquí deberías setear hasConsent en base a tu backend:
        // this.hasConsent = c.tieneConsentimiento ?? false;
        this.hasConsent = null; // por ahora "N/A"

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
