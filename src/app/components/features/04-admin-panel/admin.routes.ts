import { Routes } from '@angular/router';

// Importaciones existentes
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { UserManagement } from './pages/user-management/user-management';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

// ✅ NUEVA IMPORTACIÓN
import { StatisticsDashboard } from './pages/statistics-dashboard/statistics-dashboard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboard
      },
      {
        path: 'usuarios',
        component: UserManagement
      },
      // ✅ NUEVA RUTA DE ESTADÍSTICAS
      {
        path: 'estadisticas',
        component: StatisticsDashboard
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
