import { Route } from '@angular/router';
import { userGuard } from '../../core/guards/user.guard';

export const statisticsRoutes: Route[] = [
  {
    path: 'my-statistics',
    canActivate: [userGuard],
    loadComponent: () => import('./statistics.component').then(m => m.StatisticsComponent),
  },
];
