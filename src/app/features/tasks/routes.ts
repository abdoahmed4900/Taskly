import { userGuard } from '../../core/guards/user.guard';

export const taskRoutes = [
  {
    path: 'project/:projectId/tasks',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./show-tasks/show-tasks.component').then(m => m.ShowTasksComponent),
  },
];
