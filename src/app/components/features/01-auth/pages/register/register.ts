import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

// Nuestros Módulos y Servicios
import { MaterialModule } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/services/auth';

// Nuestros DTOs
import { RegisterUserDTO } from '../../../../core/models/register-user.dto';
import { RegisterClientDTO } from '../../../../core/models/register-client.dto';
import { ConsentDTO } from '../../../../core/models/consent.dto';

// Para el DatePicker
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './register.html', // (Tu preferencia sin .component)
  styleUrls: ['./register.css'],
  providers: [provideNativeDateAdapter()] // Proveedor para MatDatepicker
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  esMenorDeEdad = false;
  archivoConstancia: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Este formulario SÍ incluye todos los campos de tu Base de Datos
    this.registerForm = this.fb.group({
      // --- Info de USER ---
      username: ['', [Validators.required, Validators.email]], // (tu email de login)
      password: ['', [Validators.required, Validators.minLength(6)]],

      // --- Info de CLIENT ---
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]], // (tu email de perfil)
      phone: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],

      // --- Campo para calcular la edad ---
      fechaNacimiento: [null, Validators.required]
    });

    this.escucharCambiosEdad();
  }

  escucharCambiosEdad(): void {
    this.registerForm.get('fechaNacimiento')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        const hoy = new Date();
        const fechaNac = new Date(fecha);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const m = hoy.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
          edad--;
        }

        this.registerForm.get('age')?.setValue(edad);
        this.esMenorDeEdad = edad < 18;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoConstancia = input.files[0];
    }
  }

  Grabar(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.snackBar.open("Por favor, completa todos los campos requeridos", "Cerrar", { duration: 3000 });
      return;
    }

    if (this.esMenorDeEdad && !this.archivoConstancia) {
      this.snackBar.open("Siendo menor de edad, debes adjuntar una constancia", "Cerrar", { duration: 3000 });
      return;
    }

    // --- 1. DTO para /User/register ---
    const userDto: RegisterUserDTO = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      authorities: 'ROLE_USER'
    };

    // --- 2. Iniciar el proceso de registro en 3 pasos ---
    this.authService.registerUser(userDto).subscribe({
      next: (responseUsuario) => {
        const nuevoUserId = responseUsuario.id;

        // --- 3. DTO para /Clients/registrar ---
        const clientDto: RegisterClientDTO = {
          name: this.registerForm.get('name')?.value,
          lastname: this.registerForm.get('lastname')?.value,
          mail: this.registerForm.get('mail')?.value,
          phone: this.registerForm.get('phone')?.value,
          age: this.registerForm.get('age')?.value,
          user_id: nuevoUserId
        };

        this.authService.registerClientProfile(clientDto).subscribe({
          next: (responseCliente) => {
            const nuevoClienteId = responseCliente.id;

            // --- 4. (Opcional) DTO para /Consents/registrar ---
            if (this.esMenorDeEdad && this.archivoConstancia) {

              // (Aquí iría la lógica de subida de archivo. Por ahora simulamos)
              const urlArchivoSubido = `files/consents/${this.archivoConstancia.name}`;

              const consentDto: ConsentDTO = {
                doc_consent: urlArchivoSubido,
                text: 'Consentimiento de padre/tutor',
                client_id: nuevoClienteId
              };

              this.authService.registerConsent(consentDto).subscribe({
                next: () => this.registroExitoso(),
                error: (err) => this.mostrarError(err, "la constancia")
              });

            } else {
              this.registroExitoso();
            }
          },
          error: (err) => this.mostrarError(err, "el perfil de cliente")
        });
      },
      error: (err) => this.mostrarError(err, "el usuario (email ya existe?)")
    });
  }

  registroExitoso(): void {
    this.snackBar.open("¡Registro exitoso! Por favor, inicia sesión.", "Ok", { duration: 5000 });
    this.router.navigate(['/auth/login']);
  }

  mostrarError(error: any, paso: string): void {
    console.error(`Error en ${paso}:`, error);
    this.snackBar.open(`Error al registrar ${paso}. Intenta de nuevo.`, "Cerrar", { duration: 5000 });
  }
}
