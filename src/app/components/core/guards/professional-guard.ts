import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const professionalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authorities = authService.getAuthorities();

  // (Asumo que el rol se llama 'ROLE_PROFESSIONAL', lo podemos ajustar luego)
  if (authorities.includes('ROLE_PROFESSIONAL')) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
