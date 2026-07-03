import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthDomainService } from '../../features/auth/service/auth.service.domain';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  if (inject(AuthDomainService).isLoggedIn()) {
    const authToken = inject(AuthDomainService).getUserToken();
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken}`),
    });
    return next(newReq);
  }
  return next(req);
}
