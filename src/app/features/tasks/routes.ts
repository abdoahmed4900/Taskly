import { userGuard } from '../../core/guards/user.guard';

export const taskRoutes = [
  {
    path: 'project/:projectId/tasks/new',
    canActivate: [userGuard],
    loadComponent: () => import('./add-task/add-task.component').then(m => m.AddTaskComponent),
  },
];
