import { ToastService } from './../../../../../shared/service/toast.service';
import { TaskFacade } from './../../../../tasks/facade/task.facade';
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
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [TaskDetailsModalComponent, CdkDropList, CdkDrag, CdkDropListGroup],
  templateUrl: './tasks-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksBoardComponent implements OnDestroy {
  toastService = inject(ToastService);
  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      return;
    }
    console.log('dropped');

    const task = event.previousContainer.data[event.previousIndex];
    this.taskFacade
      .updateTaskStatus(task.id!, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          task.status = newStatus;
          this.tasks.update(tasks => [...tasks]);
          this.toastService.success('Updating task was successful');
        },
        error: () => {
          this.toastService.error('Error updating task');
        },
      });
  }
  tasks = model<Task[]>([]);
  projectId = input<string>('');
  router = inject(Router);
  isModalOpened = signal(false);
  selectedItem = signal<Task>({});
  paginationService = inject(PaginationService);
  projectFacade = inject(ProjectFacade);
  taskFacade = inject(TaskFacade);
  destroy$ = new Subject<void>();

  totalPages = computed(() => {
    return this.paginationService.allPages();
  });

  getTasksByStatus(status: string) {
    return this.tasks().filter(task => task.status == status);
  }

  currentPage = computed(() => {
    return this.paginationService.currentPage();
  });
  tasksPerPage = computed(() => {
    return this.paginationService.itemsPerPage();
  });

  searchQuery = model<string>('');

  @HostListener('window:scroll', [])
  getMoreTasks() {
    if (this.totalPages().at(-1) == this.currentPage()) {
      return;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
      this.nextPage();
    }
  }
  nextPage() {
    if (this.currentPage() == this.totalPages().at(-1)) {
      return;
    }
    this.paginationService.nextPage();
    this.projectFacade
      .searchProjectTasks(
        this.projectId(),
        this.searchQuery(),
        this.tasksPerPage(),
        (this.currentPage() - 1) * this.tasksPerPage(),
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
