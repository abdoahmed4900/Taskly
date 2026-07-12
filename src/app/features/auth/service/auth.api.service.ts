import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../model/user';
import { AuthDomainService } from './auth.service.domain';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  httpClient = inject(HttpClient);
  authDomainService = inject(AuthDomainService);

  registerUser(user: User) {
    return this.httpClient.post('auth/v1/signup', { ...user });
  }
  login(user: User) {
    return this.httpClient.post('auth/v1/token?grant_type=password', { ...user });
  }

  sendResetPasswordEmail(email: string) {
    return this.httpClient.post(
      'auth/v1/recover',
      { email: email },
      {
        headers: {
          redirect_to: `http://taskly-lime-nine.vercel.app/recovery`,
        },
      },
    );
  }

  resetPassword(password: string) {
    return this.httpClient.put('auth/v1/user', { password: password });
  }

  refreshToken() {
    return this.httpClient.post('auth/v1/token?grant_type=refresh_token', {
      refresh_token: `${this.authDomainService.getRefreshToken()}`,
    });
  }

  logout() {
    return this.httpClient.post('auth/v1/logout', {});
  }

  getUser() {
    return this.httpClient.get('auth/v1/user');
  }
}
