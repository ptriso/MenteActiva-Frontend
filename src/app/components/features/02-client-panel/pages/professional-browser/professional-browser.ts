import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../../../shared/material/material.imports';
import { ProfessionalService } from '../../services/professional.service';
import { ProfessionalResponseDTO } from '../../../../core/models/professional.dto';

@Component({
  selector: 'app-professional-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './professional-browser.html',
  styleUrls: ['./professional-browser.css']
})
export class ProfessionalBrowser implements OnInit {

  professionals: ProfessionalResponseDTO[] = [];

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.professionalService.getProfessionals().subscribe({
      next: (data) => {
        this.professionals = data;
      },
      error: (err) => {
        console.error("Error al cargar profesionales:", err);
      }
    });
  }
}
