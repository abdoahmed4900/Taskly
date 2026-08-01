import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Project } from '../model/project';
import { ProjectFacade } from '../facade/project.facade';
import { Subject, takeUntil } from 'rxjs';
import { Task, TaskStatus } from '../../tasks/task';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksBoardComponent } from './components/tasks-board/tasks-board.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { getNameInitials } from '../../../shared/utils';
import { PaginationService } from '../../../shared/service/pagination.service';

@Component({
  selector: 'app-show-project-tasks',
  standalone: true,
  providers: [PaginationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TasksBoardComponent, TasksListComponent],
  templateUrl: './show-project-tasks.component.html',
})
export class ShowProjectTasksComponent implements OnInit, OnDestroy {
  today = new Date();
  view = signal('board');

  allTasks = signal(0);
  allPages = signal(0);
  getDate(date: string) {
    const due = new Date(date);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (due.getTime() === today.getTime()) {
      return 'Today';
    }

    if (due.getTime() < today.getTime()) {
      return 'Overdue';
    }
    return `${new Date(date).toLocaleString('default', { month: 'short' })} ${new Date(date).getDate()}`;
  }
  project = signal<Project>(JSON.parse(sessionStorage.getItem('project')!));
  destroy$ = new Subject<void>();
  tasks = signal<Task[]>([]);
  activatedRoute = inject(ActivatedRoute);
  statusBoard = [
    TaskStatus.INPROGRESS,
    TaskStatus.BLOCKED,
    TaskStatus.DONE,
    TaskStatus.INREVIEW,
    TaskStatus.READYFORPRODUCTION,
    TaskStatus.READYFORQA,
    TaskStatus.REOPENED,
    TaskStatus.TODO,
  ];
  projectFacade = inject(ProjectFacade);
  paginationService = inject(PaginationService);
  router = inject(Router);

  constructor() {
    effect(
      () => {
        if (this.view() == 'board' || this.view() == 'list') {
          this.paginationService.currentPage.set(1);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.paginationService.itemsPerPage.set(5);
    if (!this.project().id) {
      this.project.set({
        id: this.activatedRoute.snapshot.url[1].toString(),
      });
    }
    this.view.set(this.activatedRoute.snapshot.queryParamMap.get('view') ?? 'board');
    this.projectFacade
      .getProjectTasksWithRange(this.project().id!, 0, this.paginationService.itemsPerPage())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.allTasks.set(Number(value.totalProjects));
          this.tasks.set(value.projects);
          this.paginationService.initializePagination(Number(value.totalProjects));
          console.log(value);
        },
      });
  }

  statusNumber(item: string) {
    return this.tasks().filter(t => t.status === item).length;
  }

  getNameInitials(val: string) {
    return getNameInitials(val);
  }

  setView(val: string) {
    this.view.set(val);
  }

  isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectView(view: 'board' | 'list') {
    this.view.set(view);
    this.isOpen.set(false);
  }

  goToAddTask(status: string) {
    this.router.navigate(['/project', this.project().id, 'tasks', 'new'], {
      state: {
        selectedStatus: status,
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
