import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authorities = authService.getAuthorities();

  // Tu backend asigna "ROLE_USER" al registrarse [cite: 256]
  if (authorities.includes('ROLE_CLIENT')) {
    return true;
  }

  // Si no es cliente, lo mandamos al home o login
  router.navigate(['/auth/login']);
  return false;
};
