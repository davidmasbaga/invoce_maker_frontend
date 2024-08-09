import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces';
import { Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);





  // Primero verificamos el estado de autenticación actual
  if (authService.authStatus() === AuthStatus.authenticated) {
    return true;
  }



  // Si no está autenticado, verificamos el token
  return authService.checkAuthStatus().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigateByUrl('/login');
        return false;
      }
    })
  );
};
