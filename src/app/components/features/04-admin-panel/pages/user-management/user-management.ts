import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

// Módulos y Servicios
import { MaterialModule } from '../../../../shared/material/material.imports';
import { AdminService } from '../../services/admin.service';
import { UserResponseDTO } from '../../../../core/models/user.dto';
import { AuthorityResponseDTO } from '../../../../core/models/authority.dto';
import {UserAuthorityRequestDTO} from '../../../../core/models/user-authority.dto';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagement implements OnInit {

  displayedColumns: string[] = ['id', 'username', 'enabled', 'roles', 'acciones'];
  dataSource = new MatTableDataSource<UserResponseDTO>([]);

  allRoles: AuthorityResponseDTO[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  private cargarUsuarios(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  private cargarRoles(): void {
    this.adminService.getRoles().subscribe({
      next: (roles) => {
        this.allRoles = roles;
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
      }
    });
  }

  // Filtro de la tabla
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Roles que todavía NO tiene el usuario → para el select de "Añadir rol"
  rolesDisponibles(usuario: UserResponseDTO): AuthorityResponseDTO[] {
    return this.allRoles.filter(r => !usuario.authorities.includes(r.name));
  }

  // === AÑADIR ROL ===
  anadirRol(usuario: UserResponseDTO, rolId: number): void {
    const rol = this.allRoles.find(r => r.id === rolId);
    if (!rol) return;

    if (usuario.authorities.includes(rol.name)) {
      this.snackBar.open('El usuario ya tiene este rol', 'Cerrar', { duration: 2500 });
      return;
    }

    const dto: UserAuthorityRequestDTO = {
      user_id: usuario.id,
      authority_id: rolId
    };

    this.adminService.assignRole(dto).subscribe({
      next: () => {
        usuario.authorities = [...usuario.authorities, rol.name];
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open(`Rol "${rol.name}" añadido a ${usuario.username}`, 'Ok', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error añadiendo rol:', err);
        this.snackBar.open('Error al añadir rol', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // === ELIMINAR ROL ===
  eliminarRol(usuario: UserResponseDTO, rolName: string): void {
    const rol = this.allRoles.find(r => r.name === rolName);
    if (!rol) {
      return;
    }

    // 🔴 IMPORTANTE:
    // Aquí necesitas conocer el "userAuthorityId" real (la fila en la tabla intermedia).
    // Si tu backend sólo te devuelve nombres, puedes:
    //  - ampliar tu DTO para incluir el id de User_Authority
    //  - o crear un endpoint que reciba userId + authorityId
    //
    // Por ahora dejo el llamado genérico y tú ajustas el id correcto:

    const userAuthorityId = 0; // <-- reemplázalo por el id REAL (cuando lo tengas)

    if (userAuthorityId === 0) {
      // Simulación sólo en front para que veas el comportamiento en la tabla
      usuario.authorities = usuario.authorities.filter(a => a !== rolName);
      this.dataSource.data = [...this.dataSource.data];
      this.snackBar.open(`Rol "${rolName}" eliminado de ${usuario.username} (solo front)`, 'Ok', { duration: 3000 });
      return;
    }

    this.adminService.removeRole(userAuthorityId).subscribe({
      next: () => {
        usuario.authorities = usuario.authorities.filter(a => a !== rolName);
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open(`Rol "${rolName}" eliminado de ${usuario.username}`, 'Ok', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error eliminando rol:', err);
        this.snackBar.open('Error al eliminar rol', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
