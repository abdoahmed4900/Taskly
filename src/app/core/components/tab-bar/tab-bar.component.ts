import { AuthFacade } from './../../../features/auth/facade/auth.facade';
import { Component, computed, inject } from '@angular/core';
import { ProjectsIconComponent } from '../../../shared/ui/components/projects-icon/projects-icon.component';
import { EpicsIconComponent } from '../../../shared/ui/components/epics-icon/epics-icon.component';
import { TasksIconComponent } from '../../../shared/ui/components/tasks-icon/tasks-icon.component';
import { MemebersIconComponent } from '../../../shared/ui/components/memebers-icon/memebers-icon.component';
import { DetailsIconComponent } from '../../../shared/ui/components/details-icon/details-icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [
    ProjectsIconComponent,
    EpicsIconComponent,
    TasksIconComponent,
    MemebersIconComponent,
    DetailsIconComponent,
    RouterLink,
  ],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css',
})
export class TabBarComponent {
  authFacade = inject(AuthFacade);

  isLoggedIn = computed(() => this.authFacade.authDomainService.isUserLoggedIn());
}
