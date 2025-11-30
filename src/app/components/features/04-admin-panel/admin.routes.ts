import { Routes } from '@angular/router';

// 1. Importa las clases
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { UserManagement } from './pages/user-management/user-management';
import {AdminDashboard} from './pages/admin-dashboard/admin-dashboard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout, // El Layout es el PADRE
    children: [
      // Página principal del admin
      {
        path: 'dashboard',
        component: AdminDashboard
      },
      {
        path: 'usuarios', // Ruta: /admin/usuarios
        component: UserManagement
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
