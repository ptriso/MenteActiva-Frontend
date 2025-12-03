import { Routes } from '@angular/router';
import {authGuard} from './components/core/guards/auth-guard';
import {clientGuard} from './components/core/guards/client-guard';
import {professionalGuard} from './components/core/guards/professional-guard';
import { adminGuard } from './components/core/guards/admin-guard';
import {LandingHome} from './components/features/landing-home/landing-home';


export const routes: Routes = [

  {
    path: '',
    component: LandingHome
  },
  {
    path: '',
    loadComponent: () => import('./components/features/00-landing/landing/landing')
      .then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./components/features/01-auth/auth')
      .then(m => m.AUTH_ROUTES)
  },

  {
    path: 'cliente',
    loadChildren: () => import('./components/features/02-client-panel/client')
      .then(m => m.CLIENT_ROUTES),
    canActivate: [authGuard, clientGuard]
  },
  {
    path: 'profesional',
    loadChildren: () => import('./components/features/03-professional-panel/professional.routes')
      .then(m => m.PROFESSIONAL_ROUTES),
    canActivate: [authGuard, professionalGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/features/04-admin-panel/admin.routes')
      .then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard]
  },


  { path: '**', redirectTo: '' }

];
