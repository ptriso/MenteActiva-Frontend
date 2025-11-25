import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prof-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './prof-layout.html',
  styleUrls: ['./prof-layout.css']
})
export class ProfLayout {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Lógica para cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
