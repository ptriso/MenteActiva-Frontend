import { Routes } from '@angular/router';
import {Login} from './pages/login/login';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login')
      .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register')
      .then(m => m.RegisterComponent)
  },
  {
    path: '', // Redirige /auth a /auth/login
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
