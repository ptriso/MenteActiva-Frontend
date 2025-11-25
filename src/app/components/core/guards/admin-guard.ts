import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const authorities = authService.getAuthorities();

  // 1. Buscamos el rol de Admin.
  // (Asumo que tu backend lo llama 'ROLE_ADMIN' o 'ADMIN')
  // (Tu auth.service los separa por ';')
  if (authorities.includes('ROLE_ADMIN') || authorities.includes('ADMIN')) {
    return true; // Si es admin, puede pasar
  }

  // 2. Si no es admin, lo sacamos.
  // Lo redirigimos al dashboard del cliente (si es que es cliente).
  if (authorities.includes('ROLE_USER')) {
    router.navigate(['/cliente']);
  } else {
    router.navigate(['/auth/login']); // Si no, al login
  }

  return false;
};
