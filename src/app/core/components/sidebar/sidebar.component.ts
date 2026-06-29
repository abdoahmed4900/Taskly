import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ClickOutsideDirective } from '../click-outside.directive';
import { AuthFacade } from '../../../features/auth/facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ProjectsDesktopIconComponent } from '../../../shared/ui/components/projects-desktop-icon/projects-desktop-icon.component';
import { ProjectsIconComponent } from '../../../shared/ui/components/projects-icon/projects-icon.component';
import { EpicsIconComponent } from '../../../shared/ui/components/epics-icon/epics-icon.component';
import { TasksIconComponent } from '../../../shared/ui/components/tasks-icon/tasks-icon.component';
import { MemebersIconComponent } from '../../../shared/ui/components/memebers-icon/memebers-icon.component';
import { DetailsIconComponent } from '../../../shared/ui/components/details-icon/details-icon.component';
import { WebsiteIconComponent } from '../../../shared/ui/components/website-icon/website-icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    ProjectsDesktopIconComponent,
    ProjectsIconComponent,
    EpicsIconComponent,
    TasksIconComponent,
    MemebersIconComponent,
    DetailsIconComponent,
    WebsiteIconComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnDestroy {
  router = inject(Router);

  @Output()
  closed = new EventEmitter<void>();
  authFacade = inject(AuthFacade);
  destroy$ = new Subject<void>();

  isOpen = signal(true);
  isLoggedIn = computed(() => this.authFacade.authDomainService.isUserLoggedIn());

  close() {
    if (window.innerWidth < 1024) {
      this.isOpen.set(false);
      this.closed.emit();
    }
  }

  toggleSideBar() {
    this.closed.emit();
    this.isOpen.update(v => !v);
  }

  logout() {
    this.authFacade
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isOpen.set(false);
          this.router.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
