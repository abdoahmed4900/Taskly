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
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        m => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'add-project',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./features/projects/add-project/add-project.component').then(
        m => m.AddProjectComponent,
      ),
  },
  {
    path: 'edit-project',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./features/projects/edit-project/edit-project.component').then(
        m => m.EditProjectComponent,
      ),
  },
  {
    path: 'projects',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./features/projects/show-projects/show-projects.component').then(
        m => m.ShowProjectsComponent,
      ),
  },
  {
    path: 'project/:projectId/epics',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./features/epics/project-epics/project-epics.component').then(
        m => m.ProjectEpicsComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'project',
  },
];
