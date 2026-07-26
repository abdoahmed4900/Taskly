import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
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

@Component({
  selector: 'app-show-project-tasks',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TasksBoardComponent, TasksListComponent],
  templateUrl: './show-project-tasks.component.html',
})
export class ShowProjectTasksComponent implements OnInit, OnDestroy {
  today = new Date();
  view = signal('board');
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
  router = inject(Router);

  ngOnInit(): void {
    if (!this.project().id) {
      this.project.set({
        id: this.activatedRoute.snapshot.url[1].toString(),
      });
    }
    this.projectFacade
      .getProjectTasks(this.project().id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.tasks.set(value);
        },
      });
  }

  statusNumber(item: string) {
    return this.tasks().filter(t => t.status === item).length;
  }

  getNameInitials(val: string) {
    let initials = '';
    const words = val.split(' ');

    if (words.length > 1) {
      words.map(word => {
        initials += word.charAt(0);
      });
    } else {
      initials = words[0].substring(0, 2);
    }
    console.log(val);

    return initials;
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
