import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/routes';
import { projectRoutes } from './features/projects/routes';
import { taskRoutes } from './features/tasks/routes';
import { membersRoutes } from './features/members/routes';
import { epicRoutes } from './features/epics/routes';
import { statisticsRoutes } from './features/statistics/routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'project' },
  ...authRoutes,
  ...projectRoutes,
  ...epicRoutes,
  ...membersRoutes,
  ...taskRoutes,
  ...statisticsRoutes,
  {
    path: '**',
    redirectTo: 'project',
  },
];
