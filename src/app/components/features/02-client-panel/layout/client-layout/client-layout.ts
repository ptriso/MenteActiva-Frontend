import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.imports';
import {AuthService} from '../../../../core/services/auth';
import {ClientService} from '../../services/client.service';
import {ClientResponseDTO} from '../../../../core/models/client.dto';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './client-layout.html',
  styleUrls: ['./client-layout.css']
})
export class ClientLayout implements OnInit{

  displayName = '';
  avatarLetter = 'U';
  constructor(
    private authService: AuthService,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.displayName = username;
      this.avatarLetter = username.charAt(0).toUpperCase();
    }

    const profileId = this.authService.getProfileId();
    if (profileId) {
      this.clientService.getById(profileId).subscribe({
        next: (c: ClientResponseDTO) => {
          this.displayName = `${c.name} ${c.lastname}`.trim();
          this.avatarLetter = (c.name?.charAt(0) || this.avatarLetter).toUpperCase();
        },
        error: (err) => {
          console.error('Error cargando datos de header:', err);
        }
      });
    }
  }


  verPerfil(): void {
    this.router.navigate(['/cliente/perfil']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
