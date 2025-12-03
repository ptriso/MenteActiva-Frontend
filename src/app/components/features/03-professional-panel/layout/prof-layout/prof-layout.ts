import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.imports';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import {ProfessionalService} from '../../../02-client-panel/services/professional.service';
import {Subject, takeUntil} from 'rxjs';

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
export class ProfLayout implements OnInit, OnDestroy {
  displayName = 'Profesional';
  avatarLetter = 'P';

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private professionalService: ProfessionalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const profileId = this.authService.getProfileId();

    if (!profileId) {
      this.displayName = 'Profesional';
      this.avatarLetter = 'P';
      return;
    }

    this.professionalService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((prof) => {
        if (prof) {
          this.setHeaderFromProfile(prof);
        }
      });

    this.professionalService.getById(profileId).subscribe({
      next: (prof) => {
        this.professionalService.setCurrentProfile(prof);
      },
      error: (err) => {
        console.error('Error cargando profesional en layout:', err);
        this.displayName = 'Profesional';
        this.avatarLetter = 'P';
      }
    });
  }

  private setHeaderFromProfile(prof: any): void {
    const fullName = `${prof.name} ${prof.lastname ?? ''}`.trim();
    this.displayName = `Dr. ${fullName}`;
    this.avatarLetter = (prof.name?.charAt(0) || 'P').toUpperCase();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
