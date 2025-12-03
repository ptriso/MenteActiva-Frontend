import { Routes } from '@angular/router';


import { ProfLayout } from './layout/prof-layout/prof-layout';
import { ProfDashboard } from './pages/prof-dashboard/prof-dashboard';
import { ManageSchedule } from './pages/manage-schedule/manage-schedule';
import { ManageVideos } from './pages/manage-videos/manage-videos';
import { VideoForm } from './pages/video-form/video-form';
import { MyPatients} from './pages/my-patients/my-patients';
import {ProfessionalProfile} from './pages/professional-profile/professional-profile';
import {ProfAppointmentsList} from './pages/appointments/appointments-list/appointments-list';
import {ProfUpcomingAppointments} from './pages/appointments/appointments-upcoming/appointments-upcoming';
import {AppointmentsSummaryComponent} from './pages/appointments-summary/appointments-summary';

export const PROFESSIONAL_ROUTES: Routes = [
  {
    path: '',
    component: ProfLayout,
    children: [
      {
        path: 'dashboard',
        component: ProfDashboard
      },

      {
        path: 'calendario',
        component: ManageSchedule
      },
      {
        path: 'videos',
        component: ManageVideos
      },
      {
        path: 'videos/nuevo',
        component: VideoForm
      },
      {
        path: 'videos/editar/:id',
        component: VideoForm
      },
      {
        path: 'pacientes',
        component: MyPatients
      },
      { path: 'appointments', component: ProfAppointmentsList },
      { path: 'appointments-upcoming', component: ProfUpcomingAppointments },
      { path: 'appointments-summary/:id', component: AppointmentsSummaryComponent },
      { path: 'perfil', component: ProfessionalProfile },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ]
  }
];
