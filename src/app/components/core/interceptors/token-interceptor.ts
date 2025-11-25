import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();

  // --- LÓGICA MEJORADA ---
  // Si la URL es para login o registro,
  // NO adjuntes el token (deja que la petición pase limpia).
  if (req.url.includes('/User/login') || req.url.includes('/User/register')) {
    return next(req);
  }
  // --- FIN DE LA LÓGICA ---

  // Si hay un token y NO es login/register...
  if (token) {
    // Clonamos y adjuntamos el token
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, la petición continúa
  return next(req);
};
