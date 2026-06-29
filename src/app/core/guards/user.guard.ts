import { CanActivateFn, Router } from '@angular/router';
import { AuthDomainService } from '../../features/auth/service/auth.service.domain';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authDomainService = inject(AuthDomainService);
  if (authDomainService.isUserSessionValid()) {
    return true;
  }

  router.navigateByUrl('/login', { replaceUrl: true });
  return false;
};
