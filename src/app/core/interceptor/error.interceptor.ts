import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { ErrorModel } from '../model/error';
import { AuthFacade } from '../../features/auth/facade/auth.facade';
import { ToastService } from '../../shared/service/toast.service';

const accessTokenSubject = new BehaviorSubject<string | null>(null);

let isTokenRefreshing = false;

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authFacade = inject(AuthFacade);
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError(err => {
      const errorModel: ErrorModel = { statusCode: 0, errorCode: '', errorMsg: '' };
      errorModel.statusCode = err.error['code'];
      errorModel.errorMsg = err.error['msg'] ?? err.error['message'];
      errorModel.errorCode = err.error['error_code'];
      console.log(errorModel.errorMsg);
      if (errorModel.errorMsg == 'Invalid login credentials') {
        toastService.error('Invalid email or password');
      } else {
        toastService.error(errorModel.errorMsg);
      }

      if (errorModel.statusCode == 401 || errorModel.statusCode == 403) {
        return handleRefreshToken(req, next, authFacade);
      }
      if (
        errorModel.statusCode == 400 ||
        errorModel.statusCode == 429 ||
        errorModel.statusCode == 422
      ) {
        console.log(errorModel.errorMsg);
      } else if (errorModel.statusCode >= 500) {
        console.log('Server is busy try again later');
      }

      if (
        req.url.includes('grant_type=refresh_token') ||
        errorModel.errorMsg.includes('token') ||
        errorModel.errorMsg.includes('JWT') ||
        errorModel.errorMsg.includes('jwt')
      ) {
        return handleRefreshToken(req, next, authFacade);
      }
      return throwError(() => err);
    }),
  );
}

function handleRefreshToken(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authFacade: AuthFacade,
) {
  if (isTokenRefreshing) {
    return accessTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next(addToken(req, token!))),
    );
  } else {
    accessTokenSubject.next(null);
    isTokenRefreshing = true;
    return authFacade.refreshToken().pipe(
      catchError(err => {
        //TODO: ADD LOGOUT FUNCTION WHEN FEATURE IS ADDED
        return throwError(() => err);
      }),
      switchMap(val => {
        accessTokenSubject.next(val.token);
        authFacade.authDomainService.storeUserCredentials(
          val.token,
          val.refreshToken,
          authFacade.authDomainService.isUserRemembered(),
        );
        return next(addToken(req, val.token));
      }),
      finalize(() => {
        isTokenRefreshing = false;
      }),
    );
  }
}

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
