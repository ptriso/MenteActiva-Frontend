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
import {UserAuthorityRequestDTO, UserAuthorityResponseDTO} from '../../../../core/models/user-authority.dto';

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
  userAuthorities: UserAuthorityResponseDTO[] = [];  // 👈 relaciones user-rol (con id)
  loading = true;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
    this.cargarUserAuthorities();
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

  private cargarUserAuthorities(): void {
    this.adminService.getUserAuthorities().subscribe({
      next: (ua) => {
        this.userAuthorities = ua;
      },
      error: (err) => {
        console.error('Error al cargar relaciones usuario-rol:', err);
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
      userId: usuario.id,
      authorityId: rolId
    };

    this.adminService.assignRole(dto).subscribe({
      next: (ua: UserAuthorityResponseDTO) => {
        // Actualizamos la lista de relaciones en memoria
        this.userAuthorities = [...this.userAuthorities, ua];

        // Añadimos el nombre del rol al array de authorities del usuario (para la tabla)
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
  eliminarRol(usuario: UserResponseDTO, roleName: string): void {
    // 1. Encontramos el Authority para obtener authorityId
    const rol = this.allRoles.find(r => r.name === roleName);
    if (!rol) {
      console.warn('No se encontró el rol en allRoles para', roleName);
      return;
    }

    // 2. Buscamos la relación en userAuthorities: mismo userId + authorityId
    const relacion = this.userAuthorities.find(
      ua => ua.userId === usuario.id && ua.authorityId === rol.id
    );

    if (!relacion) {
      console.warn('No se encontró la relación User_Authority para borrar', { userId: usuario.id, authorityId: rol.id });
      this.snackBar.open('No se encontró la relación usuario-rol en el sistema.', 'Cerrar', { duration: 3000 });
      return;
    }

    // 3. Llamamos al DELETE /eliminar/{id}
    this.adminService.deleteUserAuthority(relacion.id).subscribe({
      next: () => {
        // Quitamos el rol del usuario en la tabla
        usuario.authorities = usuario.authorities.filter(a => a !== roleName);
        this.dataSource.data = [...this.dataSource.data];

        // Quitamos la relación de nuestra lista local
        this.userAuthorities = this.userAuthorities.filter(ua => ua.id !== relacion.id);

        this.snackBar.open(`Rol "${roleName}" eliminado`, 'Ok', { duration: 2500 });
      },
      error: (err) => {
        console.error('Error eliminando rol:', err);
        this.snackBar.open('Error al eliminar rol.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
