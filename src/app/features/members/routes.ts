import { userGuard } from '../../core/guards/user.guard';

export const membersRoutes = [
  {
    path: 'project/:projectId/members',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./show-members/show-members.component').then(m => m.ShowMembersComponent),
  },
  {
    path: 'invite',
    canActivate: [],
    loadComponent: () => import('./invite/invite.component').then(m => m.InviteComponent),
  },
];
