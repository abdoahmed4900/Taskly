import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { ErrorModel } from '../model/error';
import { AuthFacade } from '../../features/auth/facade/auth.facade';

const accessTokenSubject = new BehaviorSubject<string | null>(null);

let isTokenRefreshing = false;

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authFacade = inject(AuthFacade);
  return next(req).pipe(
    catchError(err => {
      const errorModel: ErrorModel = { statusCode: 0, errorCode: '', errorMsg: '' };
      errorModel.statusCode = err.error['code'];
      errorModel.errorMsg = err.error['msg'];
      errorModel.errorCode = err.error['error_code'];
      console.log(errorModel.errorMsg);

      if (errorModel.statusCode == 401) {
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

      if (req.url.includes('grant_type=refresh_token')) {
        //TODO: ADD LOGOUT FUNCTION WHEN FEATURE IS ADDED
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
  console.log('in refresh func');

  if (isTokenRefreshing) {
    return accessTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next(addToken(req, token!))),
    );
  } else {
    isTokenRefreshing = true;
    accessTokenSubject.next(null);
    return authFacade.refreshToken().pipe(
      catchError(err => {
        //TODO: ADD LOGOUT FUNCTION WHEN FEATURE IS ADDED
        authFacade.authDomainService.clearUserExpriedSession();
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
      apikey: 'sb_publishable_pehy5R7dZ7ohRWxQLOEH7Q_G2uLEUBV',
      Authorization: `Bearer ${token}`,
    },
  });
}
