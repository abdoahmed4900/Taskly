import { AuthDomainService } from '../service/auth.service.domain';
import { Injectable, inject } from '@angular/core';
import { User } from '../model/user';
import { map, tap } from 'rxjs';
import { AuthApiService } from '../service/auth.api.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  authApiService = inject(AuthApiService);
  authDomainService = inject(AuthDomainService);

  registerUser(user: User) {
    return this.authApiService.registerUser(user).pipe(
      tap(u => {
        const user = JSON.parse(JSON.stringify(u));
        this.authDomainService.storeUserCredentials(user.access_token, user.refresh_token, true);

        this.authDomainService.storeUserNameAndJob(
          user.user.user_metadata.name,
          user.user.user_metadata.jobTitle,
        );
      }),
    );
  }
  login(user: User, rememberMe: boolean) {
    return this.authApiService.login(user).pipe(
      tap(u => {
        const user = JSON.parse(JSON.stringify(u));
        this.authDomainService.storeUserCredentials(
          user.access_token,
          user.refresh_token,
          rememberMe,
        );
        this.authDomainService.storeUserNameAndJob(
          user.user.user_metadata.name,
          user.user.user_metadata.jobTitle,
        );
      }),
    );
  }

  sendResetPasswordEmail(email: string) {
    return this.authApiService.sendResetPasswordEmail(email);
  }

  resetPassword(password: string) {
    return this.authApiService.resetPassword(password).pipe(
      tap(() => {
        this.authDomainService.isUserLoggedIn.set(true);
      }),
    );
  }

  refreshToken() {
    return this.authApiService.refreshToken().pipe(
      map(v => {
        return this.authDomainService.resetUserTokensAfterRefresh(v);
      }),
    );
  }

  getUser() {
    return this.authApiService.getUser().pipe(
      tap(v => {
        const user = JSON.parse(JSON.stringify(v));
        this.authDomainService.storeUserNameAndJob(
          user.user_metadata.name,
          user.user_metadata.jobTitle,
        );
      }),
    );
  }

  logout() {
    return this.authApiService.logout().pipe(
      tap(() => {
        this.authDomainService.clearUserExpriedSession();
      }),
    );
  }
}
