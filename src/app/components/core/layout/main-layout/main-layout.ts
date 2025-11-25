import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 2. Importa CommonModule

@Component({
  selector: 'app-main-layout',
  standalone: true, // <-- 3. AÑADE ESTO
  imports: [CommonModule], // <-- 4. AÑADE ESTO (para ng-content)
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout { // <-- 1. CAMBIA EL NOMBRE AQUÍ

}
