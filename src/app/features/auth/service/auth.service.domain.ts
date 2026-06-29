import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthDomainService {
  userToken = signal('');
  isUserLoggedIn = signal(false);
  name = signal('');
  job = signal('');
  constructor() {
    if (this.isLoggedIn()) {
      this.userToken.set(localStorage.getItem('token') ?? sessionStorage.getItem('token')!);
      this.isUserLoggedIn.set(true);
    }
  }
  storeUserCredentials(jwtToken: string, refreshToken: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('refreshToken', refreshToken);
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      localStorage.setItem('rememberMeExpiry', expirationDate.toISOString().split('T')[0]);
    } else {
      sessionStorage.setItem('token', jwtToken);
      sessionStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('rememberMe', `${rememberMe}`);
    this.userToken.set(jwtToken);
    this.isUserLoggedIn.set(true);
  }

  storeUserNameAndJob(name: string, job: string) {
    if (this.isUserRemembered()) {
      localStorage.setItem('name', name);
      localStorage.setItem('job', job);
    } else {
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('job', job);
    }
    this.name.set(name);
    this.job.set(job);
  }

  isLoggedIn() {
    if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isUserSessionValid() {
    if (sessionStorage.getItem('token')) {
      return true;
    }

    if (!localStorage.getItem('token')) {
      return false;
    }

    const expiry = localStorage.getItem('rememberMeExpiry');

    if (!expiry) {
      return false;
    }

    return new Date() < new Date(expiry);
  }

  isUserRemembered() {
    return Boolean(localStorage.getItem('rememberMe') == 'true');
  }

  // calculateDays(firstDate: string, secondDate: string) {
  //   const date1 = new Date(firstDate);
  //   const date2 = new Date(secondDate);

  //   const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  //   const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

  //   const timeDiff = Math.abs(utc2 - utc1);
  //   const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  //   return daysDiff;
  // }

  clearUserExpriedSession() {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('name');
    localStorage.removeItem('job');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('job');
    this.userToken.set('');
    this.name.set('');
    this.job.set('');
    this.isUserLoggedIn.set(false);
  }

  resetUserTokensAfterRefresh(v: unknown) {
    const user = JSON.parse(JSON.stringify(v));
    if (this.isUserRemembered()) {
      localStorage.setItem('token', user.access_token);
      localStorage.setItem('refreshToken', user.refreshToken);
    }
    return { refreshToken: user.refreshToken, token: user.access_token };
  }
}
