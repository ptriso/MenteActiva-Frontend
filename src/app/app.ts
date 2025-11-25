// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// --- 1. ESTA ES LA RUTA CORREGIDA (sin '/components') ---
import { MainLayout } from './components/core/layout/main-layout/main-layout'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MainLayout
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'MenteActiva-Frontend';
}
