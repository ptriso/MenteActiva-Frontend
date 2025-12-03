import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authorities = authService.getAuthorities();

  if (authorities.includes('ROLE_CLIENT')) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
