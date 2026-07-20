import { userGuard } from '../../core/guards/user.guard';

export const epicRoutes = [
  {
    path: 'project/:projectId/epics',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./project-epics/project-epics.component').then(m => m.ProjectEpicsComponent),
  },
  {
    path: 'project/:projectId/epics/new',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./components/add-epic/add-epic.component').then(m => m.AddEpicComponent),
  },
];
