import { Component } from '@angular/core';
import { ProjectsIconComponent } from '../../../shared/ui/components/projects-icon/projects-icon.component';
import { EpicsIconComponent } from '../../../shared/ui/components/epics-icon/epics-icon.component';
import { TasksIconComponent } from '../../../shared/ui/components/tasks-icon/tasks-icon.component';
import { MemebersIconComponent } from '../../../shared/ui/components/memebers-icon/memebers-icon.component';
import { DetailsIconComponent } from '../../../shared/ui/components/details-icon/details-icon.component';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [
    ProjectsIconComponent,
    EpicsIconComponent,
    TasksIconComponent,
    MemebersIconComponent,
    DetailsIconComponent,
  ],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css',
})
export class TabBarComponent {}
