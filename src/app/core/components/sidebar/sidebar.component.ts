import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Type,
  computed,
  inject,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ClickOutsideDirective } from '../click-outside.directive';
import { AuthFacade } from '../../../features/auth/facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { ProjectsIconComponent } from '../../../shared/ui/components/projects-icon/projects-icon.component';
import { EpicsIconComponent } from '../../../shared/ui/components/epics-icon/epics-icon.component';
import { TasksIconComponent } from '../../../shared/ui/components/tasks-icon/tasks-icon.component';
import { MemebersIconComponent } from '../../../shared/ui/components/memebers-icon/memebers-icon.component';
import { DetailsIconComponent } from '../../../shared/ui/components/details-icon/details-icon.component';
import { WebsiteIconComponent } from '../../../shared/ui/components/website-icon/website-icon.component';
import { NgComponentOutlet } from '@angular/common';
import { ToastService } from '../../../shared/service/toast.service';
import { ProjectFacade } from '../../../features/projects/facade/project.facade';
import { Project } from '../../../features/projects/model/project';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ClickOutsideDirective, WebsiteIconComponent, NgComponentOutlet],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnDestroy, OnInit {
  router = inject(Router);
  isSidebarToggled = model<boolean>(false);
  currentUrl = signal(this.router.url);
  toastService = inject(ToastService);
  sideBar = viewChild<ElementRef<HTMLElement>>('sidebar');
  projectId = signal('');
  project = signal<Project>({});

  ngOnInit() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.url == '/' ? '/project' : event.url);
        if (event.url.split('/')[2]) {
          this.projectId.set(this.currentUrl() == '/project' ? '' : event.url.split('/')[2]);
        }
        if (this.currentUrl() == '/project') {
          this.projectId.set('');
        }
        this.loadProject();
      }
    });
  }

  private loadProject() {
    this.projectFacade
      .getProject(this.projectId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.project.set(value!);
        },
        error: () => {
          this.toastService.error('Error Loading Project!');
          this.router.navigateByUrl('/project');
        },
      });
  }

  authFacade = inject(AuthFacade);
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();

  isOpen = output<boolean>();
  isLoggedIn = computed(() => this.authFacade.authDomainService.isUserLoggedIn());

  items = computed(() => {
    return [
      { title: 'Projects', route: '/project', icon: ProjectsIconComponent },
      {
        title: 'Project Epics',
        route: `/project/${this.projectId()}/epics`,
        icon: EpicsIconComponent,
      },
      {
        title: 'Project Tasks',
        route: `/project/${this.projectId()}/tasks`,
        icon: TasksIconComponent,
      },
      {
        title: 'Project Members',
        route: `/project/${this.projectId()}/members`,
        icon: MemebersIconComponent,
      },
      {
        title: 'Project Details',
        route: `/project/${this.projectId()}/edit`,
        icon: DetailsIconComponent,
      },
    ] as { title: string; route: string; icon: Type<unknown> }[];
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
    this.router.navigate([route], { state: { project: this.project() } });
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
