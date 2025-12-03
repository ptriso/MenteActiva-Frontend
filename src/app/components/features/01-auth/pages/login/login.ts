import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/services/auth';
import { LoginDTO } from '../../../../core/models/login.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.CargarFormulario();
  }
  IrALanding(): void {
    this.router.navigate(['/']);
  }
  IrARegistro(): void {
    this.router.navigate(['/auth/register']);
  }
  IrARecuperar(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  CargarFormulario(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  Ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginDto: LoginDTO = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.authService.login(loginDto).subscribe({
      next: (data) => {

        const roles = this.authService.getAuthorities();

        console.log('Login exitoso. Roles obtenidos:', roles);

        if (roles.includes('ROLE_ADMIN')) {
          console.log('Redirigiendo a /admin');
          this.router.navigate(['/admin']);

        } else if (roles.includes('ROLE_PROFESSIONAL')) {
          console.log('Redirigiendo a /profesional');
          this.router.navigate(['/profesional']);

        } else if (roles.includes('ROLE_USER') || roles.includes('ROLE_CLIENT')) {
          console.log('Redirigiendo a /cliente');
          this.router.navigate(['/cliente']);

        } else {
          console.log('No se encontró un rol conocido, redirigiendo a /');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error("Error en login:", err);
        this.snackBar.open("Error: Correo o contraseña incorrectos", "Cerrar", {
          duration: 5000,
        });
      }
    });

  }
}
