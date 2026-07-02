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
    return this.httpClient.post('signup', { ...user });
  }
  login(user: User) {
    return this.httpClient.post('token?grant_type=password', { ...user });
  }

  sendResetPasswordEmail(email: string) {
    return this.httpClient.post(
      'recover',
      { email: email },
      {
        headers: {
          redirect_to: 'https://taskly-lime-nine.vercel.app/reset-password',
        },
      },
    );
  }

  resetPassword(password: string) {
    return this.httpClient.put('user', { password: password });
  }

  refreshToken() {
    return this.httpClient.post('token?grant_type=refresh_token', {
      refresh_token: `${this.authDomainService.getRefreshToken()}`,
    });
  }

  logout() {
    return this.httpClient.post('logout', {});
  }

  getUser() {
    return this.httpClient.get('user');
  }
}
