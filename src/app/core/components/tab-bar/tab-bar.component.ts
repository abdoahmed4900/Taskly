import { AuthFacade } from './../../../features/auth/facade/auth.facade';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IconComponent } from '../../../shared/ui/components/icon-component/icon-component.component';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css',
})
export class TabBarComponent implements OnInit {
  routeItems: UrlSegment[] = [];
  ngOnInit(): void {
    // const project = JSON.parse(sessionStorage.getItem('project')!) as Project;
    // this.projectId.set(project.id!);
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.url == '/' ? '/project' : event.url);
        this.projectId.set(event.url.split('/')[2]);
      }
      if (this.currentUrl() == '/project') {
        this.projectId.set('');
      }
    });
  }
  destroy$ = new Subject<void>();
  authFacade = inject(AuthFacade);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  currentUrl = signal(this.router.url);

  projectId = signal('');

  navigateToPage(route: string) {
    console.log(route);
    let extras = {};
    console.log(route.endsWith('tasks'));

    if (route.endsWith('tasks')) {
      extras = {
        queryParams: {
          view: 'board',
        },
      };
    }
    this.router.navigate([route], { ...extras });
  }

  isLoggedIn = computed(() => this.authFacade.authDomainService.isUserLoggedIn());
  isActive(item: { route: string; title: string }) {
    if (item.title === 'Project Tasks') {
      return this.router.url.includes(`/project/${this.projectId()}/tasks`);
    }

    return this.router.url === item.route;
  }
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
    ] as { title: string; route: string; icon: string }[];
  });
}
