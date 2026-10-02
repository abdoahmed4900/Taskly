import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ClickOutsideDirective } from '../click-outside.directive';
import { AuthFacade } from '../../../features/auth/facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../shared/service/toast.service';
import { ProjectFacade } from '../../../features/projects/facade/project.facade';
import { Project } from '../../../features/projects/model/project';
import { IconComponent } from '../../../shared/ui/components/icon-component/icon-component.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ClickOutsideDirective, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnDestroy, OnInit {
  router = inject(Router);
  isSidebarToggled = model<boolean>(false);
  toastService = inject(ToastService);
  sideBar = viewChild<ElementRef<HTMLElement>>('sidebar');
  projectId = signal('');
  project = signal<Project>({});
  isActive = signal(false);
  activatedRoute = inject(ActivatedRoute);
  currentUrl = signal('');

  constructor() {
    effect(() => {
      console.log(this.projectId());
      console.log(this.currentUrl());
    });
  }

  ngOnInit() {
    this.currentUrl.set(this.router.url);

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event.url.split('?')[0]);

        this.currentUrl.set(event.url == '/' ? '/project' : event.url.split('?')[0]);
        if (event.url.split('/')[2]) {
          this.projectId.set(this.currentUrl() == '/project' ? '' : event.url.split('/')[2]);
        }

        if (this.currentUrl() == '/project' || this.currentUrl() == '/my-statistics') {
          this.projectId.set('');
        }
      }
    });
  }

  authFacade = inject(AuthFacade);
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();

  isRouteActive(route: string) {
    console.log(`this.currentUrl() == route : ${this.currentUrl() == route}`);

    return this.currentUrl() == route;
  }

  isOpen = output<boolean>();
  isLoggedIn = computed(() => this.authFacade.authDomainService.isUserLoggedIn());

  items = computed(() => {
    return [
      { title: 'Projects', route: '/project', icon: 'projects' },
      {
        title: 'Project Epics',
        route: `/project/${this.projectId()}/epics`,
        icon: 'epics',
      },
      {
        title: 'Project Tasks',
        route: `/project/${this.projectId()}/tasks`,
        icon: 'tasks',
      },
      {
        title: 'Project Members',
        route: `/project/${this.projectId()}/members`,
        icon: 'members',
      },
      {
        title: 'Project Details',
        route: `/project/${this.projectId()}/edit`,
        icon: 'details',
      },
      {
        title: 'My Statistics',
        route: `/my-statistics`,
        icon: 'analytics',
      },
    ] as { title: string; route: string; icon: string }[];
  });

  toggleSideBar() {
    this.isSidebarToggled.update(v => !v);
    this.isOpen.emit(this.isSidebarToggled());
  }
  close() {
    this.isSidebarToggled.set(false);
    this.isOpen.emit(false);
  }

  navigateToPage(route: string) {
    let extras = {};

    if (route.endsWith('tasks')) {
      extras = {
        queryParams: {
          view: 'board',
        },
      };
    }
    this.router.navigate([route], { ...extras });
  }

  logout() {
    this.authFacade
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSidebarToggled.set(false);
          this.isOpen.emit(false);
          this.toastService.success('Logged out successfully');
          this.router.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
