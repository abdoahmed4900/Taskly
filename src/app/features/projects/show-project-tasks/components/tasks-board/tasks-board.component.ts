import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { Task, TaskStatus } from '../../../../tasks/task';
import { Router } from '@angular/router';
import { getNameInitials } from '../../../../../shared/utils';
import { TaskDetailsModalComponent } from '../task-modal/task-modal.component';
import { PaginationService } from '../../../../../shared/service/pagination.service';
import { ProjectFacade } from '../../../facade/project.facade';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [TaskDetailsModalComponent],
  templateUrl: './tasks-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksBoardComponent implements OnDestroy {
  tasks = model<Task[]>([]);
  projectId = input<string>('');
  router = inject(Router);
  isModalOpened = signal(false);
  selectedItem = signal<Task>({});
  paginationService = inject(PaginationService);
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();

  totalPages = computed(() => {
    return this.paginationService.allPages();
  });

  currentPage = computed(() => {
    return this.paginationService.currentPage();
  });
  tasksPerPage = computed(() => {
    return this.paginationService.itemsPerPage();
  });

  @HostListener('window:scroll', [])
  getMoreTasks() {
    if (this.totalPages().at(-1) == this.currentPage()) {
      return;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
      this.nextPage();
    }
  }
  nextPage() {
    if (this.currentPage() == this.totalPages().at(-1)) {
      return;
    }
    this.paginationService.nextPage();
    this.projectFacade
      .getProjectTasksWithRange(
        this.projectId(),
        (this.currentPage() - 1) * this.tasksPerPage(),
        this.tasksPerPage(),
      )
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.tasks.update(v => [...v, ...value.projects]);
        },
      });
  }

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

  statusNumber(item: string) {
    return this.tasks().filter(t => t.status === item).length;
  }

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

  getNameInitials(val: string) {
    return getNameInitials(val);
  }
  setModalStatus(item: Task) {
    this.isModalOpened.update(v => !v);

    this.selectedItem.set(item);
  }
  goToAddTask(status: string) {
    this.router.navigate(['/project', this.projectId(), 'tasks', 'new'], {
      state: {
        selectedStatus: status,
      },
    });
  }

  close() {
    this.isModalOpened.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
