import { userGuard } from '../../core/guards/user.guard';

export const projectRoutes = [
  {
    path: 'project',
    loadComponent: () =>
      import('./show-projects/show-projects.component').then(m => m.ShowProjectsComponent),
    canActivate: [userGuard],
  },
  {
    path: 'add-project',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./add-project/add-project.component').then(m => m.AddProjectComponent),
  },
  {
    path: 'project/:projectId/edit',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./edit-project/edit-project.component').then(m => m.EditProjectComponent),
  },
  {
    path: 'project/:projectId/tasks',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./show-project-tasks/show-project-tasks.component').then(
        m => m.ShowProjectTasksComponent,
      ),
  },
];
