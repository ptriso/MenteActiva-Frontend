import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// Nuestros imports
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
export class Login implements OnInit { // (Usando tu convención de nombres)

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

  CargarFormulario(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  /**
   * Lógica de Ingresar con Redirección por Rol (¡CON DEPURACIÓN!)
   */
  Ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginDto: LoginDTO = {
      username: this.loginForm.get("username")?.value,
      password: this.loginForm.get("password")?.value
    };

    this.authService.login(loginDto).subscribe({
      next: (data) => {
        // --- ¡ESTA ES LA LÓGICA DE DEPURACIÓN! ---

        // 1. Leemos los roles que el AuthService guardó en localStorage
        const roles = this.authService.getAuthorities();

        // 2. ¡MIRA LA CONSOLA! Aquí verás los roles que tienes
        console.log('Login exitoso. Roles obtenidos:', roles);

        // 3. Comparamos los roles
        if (roles.includes('ROLE_ADMIN')) {
          console.log('Redirigiendo a /admin');
          this.router.navigate(['/admin']);

        } else if (roles.includes('ROLE_PROFESSIONAL')) {
          console.log('Redirigiendo a /profesional');
          this.router.navigate(['/profesional']);

          // (Añadí ROLE_CLIENT por si acaso, basado en tu backend)
        } else if (roles.includes('ROLE_USER') || roles.includes('ROLE_CLIENT')) {
          console.log('Redirigiendo a /cliente');
          this.router.navigate(['/cliente']);

        } else {
          console.log('No se encontró un rol conocido, redirigiendo a /');
          this.router.navigate(['/']);
        }
        // --- FIN DE LA LÓGICA ---
      },
      error: (err) => {
        console.error("Error en login:", err);
        this.snackBar.open("Error: Usuario o contraseña incorrectos", "Cerrar", {
          duration: 5000,
        });
      }
    });
  }
}
