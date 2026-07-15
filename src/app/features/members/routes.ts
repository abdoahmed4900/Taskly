import { userGuard } from '../../core/guards/user.guard';

export const membersRoutes = [
  {
    path: 'project/:projectId/members',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./show-members/show-members.component').then(m => m.ShowMembersComponent),
  },
];
