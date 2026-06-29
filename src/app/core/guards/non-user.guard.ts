import { CanActivateFn } from '@angular/router';
import { AuthDomainService } from '../../features/auth/service/auth.service.domain';
import { inject } from '@angular/core';

export const nonUserGuard: CanActivateFn = () => {
  const authDomainService = inject(AuthDomainService);
  const isSessionValid = authDomainService.isUserSessionValid();
  if (isSessionValid) {
    return false;
  }
  return true;
};
