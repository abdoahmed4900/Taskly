import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { nonUserGuard } from './core/guards/non-user.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'project' },
  {
    path: 'project',
    loadComponent: () =>
      import('./features/projects/show-projects/show-projects.component').then(
        m => m.ShowProjectsComponent,
      ),
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
    path: 'recovery',
    loadComponent: () =>
      import('./features/auth/recovery/recovery.component').then(m => m.RecoveryComponent),
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
    path: 'project/:projectId/edit',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./features/projects/edit-project/edit-project.component').then(
        m => m.EditProjectComponent,
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
    path: 'project/:projectId/members',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./features/members/show-members/show-members.component').then(
        m => m.ShowMembersComponent,
      ),
  },
  {
    path: 'project/:projectId/tasks',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./features/tasks/show-tasks/show-tasks.component').then(m => m.ShowTasksComponent),
  },
  {
    path: '**',
    redirectTo: 'project',
  },
];
