import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const authorities = authService.getAuthorities();

  if (authorities.includes('ROLE_ADMIN') || authorities.includes('ADMIN')) {
    return true;
  }

  if (authorities.includes('ROLE_USER')) {
    router.navigate(['/cliente']);
  } else {
    router.navigate(['/auth/login']);
  }

  return false;
};
