import { Routes } from '@angular/router';

// 1. Importa el Layout y la Página que acabamos de crear
import { ProfLayout } from './layout/prof-layout/prof-layout';
import { ProfDashboard } from './pages/prof-dashboard/prof-dashboard';
import { ManageSchedule } from './pages/manage-schedule/manage-schedule';
import { ManageVideos } from './pages/manage-videos/manage-videos';
import { VideoForm } from './pages/video-form/video-form';
import { MyPatients} from './pages/my-patients/my-patients';
import {ProfessionalProfile} from './pages/professional-profile/professional-profile';

export const PROFESSIONAL_ROUTES: Routes = [
  {
    path: '',
    component: ProfLayout, // El Layout es el PADRE
    children: [
      // Estas son las páginas que se cargan DENTRO
      {
        path: 'dashboard', // Ruta: /profesional/dashboard
        component: ProfDashboard
      },

      // (Aquí añadiremos 'gestionar-horarios', 'gestionar-videos', etc.)}
      {
        path: 'calendario', // Ruta: /profesional/calendario
        component: ManageSchedule
      },
      {
        path: 'videos', // Ruta: /profesional/videos (La lista)
        component: ManageVideos
      },
      {
        path: 'videos/nuevo', // Ruta: /profesional/videos/nuevo (El formulario)
        component: VideoForm
      },
      {
        path: 'videos/editar/:id', // Ruta: /profesional/videos/editar/1
        component: VideoForm
      },
      {
        path: 'pacientes', // Ruta: /profesional/pacientes
        component: MyPatients
      },
      { path: 'perfil', component: ProfessionalProfile },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
