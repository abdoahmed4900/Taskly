import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { ClickOutsideDirective } from '../click-outside.directive';
import { AuthFacade } from '../../../features/auth/facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { ProjectsIconComponent } from '../../../shared/ui/components/projects-icon/projects-icon.component';
import { EpicsIconComponent } from '../../../shared/ui/components/epics-icon/epics-icon.component';
import { TasksIconComponent } from '../../../shared/ui/components/tasks-icon/tasks-icon.component';
import { MemebersIconComponent } from '../../../shared/ui/components/memebers-icon/memebers-icon.component';
import { DetailsIconComponent } from '../../../shared/ui/components/details-icon/details-icon.component';
import { WebsiteIconComponent } from '../../../shared/ui/components/website-icon/website-icon.component';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ClickOutsideDirective, WebsiteIconComponent, RouterLink, NgComponentOutlet],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnDestroy, OnInit {
  router = inject(Router);
  isSidebarToggled = output<boolean>();
  currentUrl = signal(this.router.url);
  closed = output();

  ngOnInit() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Handle route change here
        this.currentUrl.set(event.url);
      }
    });
  }

  authFacade = inject(AuthFacade);
  destroy$ = new Subject<void>();

  isOpen = signal(true);
  isLoggedIn = computed(() => this.authFacade.authDomainService.isUserLoggedIn());

  readonly items = [
    {
      title: 'Projects',
      route: '/projects',
      icon: ProjectsIconComponent,
    },
    {
      title: 'Project Epics',
      route: '/epics',
      icon: EpicsIconComponent,
    },
    {
      title: 'Project Tasks',
      route: '/tasks',
      icon: TasksIconComponent,
    },
    {
      title: 'Project Members',
      route: '/members',
      icon: MemebersIconComponent,
    },
    {
      title: 'Project Details',
      route: '/details',
      icon: DetailsIconComponent,
    },
  ];

  toggleSideBar() {
    this.isOpen.update(v => !v);
    this.isSidebarToggled.emit(this.isOpen());
    this.closed.emit();
  }
  close() {
    this.isOpen.set(false);
    this.isSidebarToggled.emit(false);
    this.closed.emit();
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
