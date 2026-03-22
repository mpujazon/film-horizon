import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth-service';
import {map, take} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user=>
      user?
        (user?.emailVerified? true : router.createUrlTree(['verify-email']))
        : router.createUrlTree(['login'])
    )
  )
};
