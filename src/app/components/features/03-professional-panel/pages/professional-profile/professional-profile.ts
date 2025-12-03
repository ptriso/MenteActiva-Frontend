import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {AuthService} from '../../../../core/services/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfessionalService} from '../../services/prof-service';

@Component({
  selector: 'app-professional-profile',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './professional-profile.html',
  styleUrl: './professional-profile.css',
})
export class ProfessionalProfile implements OnInit{
  form!: FormGroup;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private professionalService: ProfessionalService,
    private snackBar: MatSnackBar
  ) {}
  specializations = [
    { value: 'Psiquiatra', label: 'Psiquiatra' },
    { value: 'Psicologo', label: 'Psicólogo' },
    { value: 'Neurologo', label: 'Neurólogo' },
    { value: 'NONE', label: 'Sin especialidad' }
  ];
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      specialization: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    });

    const profileId = this.authService.getProfileId();
    if (!profileId) {
      this.loading = false;
      return;
    }

    this.professionalService.getById(profileId).subscribe({
      next: (p: any) => {
        this.form.patchValue({
          name: p.name,
          lastname: p.lastname,
          specialization: p.specialization,
          mail: p.mail,
          phone: p.phone
        });
        this.professionalService.setCurrentProfile(p);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil profesional:', err);
        this.snackBar.open('Error al cargar el perfil.', 'Cerrar', { duration: 4000 });
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

    const dto: any = {
      name: this.form.get('name')?.value,
      lastname: this.form.get('lastname')?.value,
      specialization: this.form.get('specialization')?.value,
      mail: this.form.get('mail')?.value,
      phone: this.form.get('phone')?.value,
      userId: userId
    };

    this.professionalService.update(profileId, dto).subscribe({
      next: (updated) => {
        this.snackBar.open('Perfil actualizado correctamente', 'Ok', { duration: 4000 });
        const profToBroadcast = updated ?? { ...dto, id: profileId };
        this.professionalService.setCurrentProfile(profToBroadcast);
      },
      error: (err) => {
        console.error('Error actualizando perfil profesional:', err);
        this.snackBar.open('Error al actualizar el perfil.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  get avatarLetter(): string {
    return (this.form.get('name')?.value?.charAt(0) || 'P').toUpperCase();
  }

}
