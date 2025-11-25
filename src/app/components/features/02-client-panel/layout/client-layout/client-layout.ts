import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router'; // <-- IMPORTANTE
import { MaterialModule } from '../../../../shared/material/material.imports';
import {AuthService} from '../../../../core/services/auth'; // <-- IMPORTANTE

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,     // <-- AÑADIR
    MaterialModule    // <-- AÑADIR
  ],
  templateUrl: './client-layout.html',
  styleUrls: ['./client-layout.css']
})
export class ClientLayout {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  // Lógica para cerrar sesión
  logout() {
    this.authService.logout(); // Borra el token del localStorage
    this.router.navigate(['/auth/login']); // Redirige a la página de login
  }
}
