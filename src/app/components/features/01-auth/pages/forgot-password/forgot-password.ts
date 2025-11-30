import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, MaterialModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  soporteEmail = 'soporte@menteactiva.pe';

  constructor(private router: Router) {}

  volverLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
