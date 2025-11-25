import { Routes } from '@angular/router';

// --- 1. IMPORTA LOS NOMBRES DE CLASE CORRECTOS ---
import { ClientLayout } from './layout/client-layout/client-layout';
import { ClientDashboard } from './pages/client-dashboard/client-dashboard';
import { VideoBrowser } from './pages/video-browser/video-browser';
import { ProfessionalBrowser } from './pages/professional-browser/professional-browser';
import { SchedulePicker } from './pages/schedule-picker/schedule-picker';
import { MyAppointments } from './pages/my-appointments/my-appointments';
import {ClientProgress} from './pages/client-progress/client-progress';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientLayout, // <-- 2. USA EL NOMBRE CORRECTO
    children: [
      // --- 3. USA LOS NOMBRES CORRECTOS AQUÍ TAMBIÉN ---
      { path: 'dashboard', component: ClientDashboard },
      { path: 'videos', component: VideoBrowser },
      { path: 'profesionales', component: ProfessionalBrowser },
      { path: 'agendar/:id', component: SchedulePicker },
      {path: 'progreso', component: ClientProgress},
      { path: 'citas', component: MyAppointments },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
