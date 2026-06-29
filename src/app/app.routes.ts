import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { nonUserGuard } from './core/guards/non-user.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'project' },
  {
    path: 'project',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [userGuard],
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(m => m.SignupComponent),
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
      import('./features/auth/forgot-password/forgot-password.component').then(
        m => m.ForgotPasswordComponent,
      ),
    canActivate: [nonUserGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        m => m.ResetPasswordComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'project',
  },
];
