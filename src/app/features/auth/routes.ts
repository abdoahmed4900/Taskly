import { Route } from '@angular/router';
import { nonUserGuard } from '../../core/guards/non-user.guard';
import { LoginComponent } from './login/login.component';

export const authRoutes: Route[] = [
  {
    path: 'sign-up',
    loadComponent: () => import('../auth/signup/signup.component').then(m => m.SignupComponent),
    canActivate: [nonUserGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [nonUserGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [nonUserGuard],
  },
  {
    path: 'recovery',
    loadComponent: () => import('./recovery/recovery.component').then(m => m.RecoveryComponent),
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
];
