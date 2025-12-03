import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.imports';

@Component({
  selector: 'app-prof-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './prof-dashboard.html',
  styleUrls: ['./prof-dashboard.css']
})
export class ProfDashboard {

}
