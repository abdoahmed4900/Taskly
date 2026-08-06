import { Type } from '@angular/core';
import { ProjectsIconComponent } from './ui/components/projects-icon/projects-icon.component';
import { EpicsIconComponent } from './ui/components/epics-icon/epics-icon.component';
import { TasksIconComponent } from './ui/components/tasks-icon/tasks-icon.component';
import { MemebersIconComponent } from './ui/components/memebers-icon/memebers-icon.component';
import { DetailsIconComponent } from './ui/components/details-icon/details-icon.component';

export const navbarItems = (projectId: string) =>
  [
    { title: 'Projects', route: '/project', icon: ProjectsIconComponent },
    {
      title: 'Project Epics',
      route: `/project/${projectId}/epics`,
      icon: EpicsIconComponent,
    },
    {
      title: 'Project Tasks',
      route: `/project/${projectId}/tasks`,
      icon: TasksIconComponent,
    },
    {
      title: 'Project Members',
      route: `/project/${projectId}/members`,
      icon: MemebersIconComponent,
    },
    {
      title: 'Project Details',
      route: `/project/${projectId}/edit`,
      icon: DetailsIconComponent,
    },
  ] as { title: string; route: string; icon: Type<unknown> }[];
