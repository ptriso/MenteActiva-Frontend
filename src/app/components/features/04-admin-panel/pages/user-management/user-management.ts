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

  dataSource = new MatTableDataSource<UserResponseDTO>();
  displayedColumns: string[] = ['id', 'username', 'roles', 'acciones'];

  allRoles: AuthorityResponseDTO[] = []; // Para el dropdown

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => console.error("Error al cargar usuarios:", err)
    });
  }

  cargarRoles(): void {
    this.adminService.getRoles().subscribe({
      next: (data) => {
        this.allRoles = data;
      },
      error: (err) => console.error("Error al cargar roles:", err)
    });
  }

  // Filtro de la tabla (como tu profesor)
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Lógica para cambiar el rol
  cambiarRol(usuario: UserResponseDTO, nuevoRolId: number) {

    // (Esta lógica es una SIMULACIÓN y necesita que la valides con tu backend)
    console.log(`Cambiando rol de ${usuario.username} a ${nuevoRolId}`);

    // 1. Encontrar el ID del rol "PROFESIONAL"
    const rolProfesional = this.allRoles.find(r => r.name === 'ROLE_PROFESSIONAL');

    if (nuevoRolId === rolProfesional?.id) {
      // 2. Aquí llamaríamos a adminService.assignRole(...)
      this.snackBar.open(`Rol de ${usuario.username} actualizado (simulado)`, "Ok", { duration: 3000 });
    } else {
      // 3. Aquí llamaríamos a adminService.removeRole(...)
    }
  }
}
