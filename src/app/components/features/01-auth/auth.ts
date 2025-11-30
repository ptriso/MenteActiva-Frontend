import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {ForgotPassword} from './pages/forgot-password/forgot-password';

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
  { path: 'forgot-password', component: ForgotPassword },
  {
    path: '', // Redirige /auth a /auth/login
    redirectTo: 'login',
    pathMatch: 'full'
  }

];

