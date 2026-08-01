import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { Task } from '../../../../tasks/task';
import { RouterLink } from '@angular/router';
import { TaskFacade } from '../../../../tasks/facade/task.facade';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { getNameInitials } from '../../../../../shared/utils';
import { TaskDetailsModalComponent } from '../task-modal/task-modal.component';
import { PaginationService } from '../../../../../shared/service/pagination.service';
import { ProjectFacade } from '../../../facade/project.facade';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  providers: [],
  imports: [RouterLink, TaskDetailsModalComponent],
  templateUrl: './tasks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  tasks = model<Task[]>([]);
  projectId = input<string>('');
  isModalOpened = signal(false);
  selectedItem = signal<Task>({});
  taskFacade = inject(TaskFacade);
  destroy$ = new Subject<void>();
  allTasks = model(0);
  projectFacade = inject(ProjectFacade);

  @HostListener('window:scroll', [])
  getMoreTasks() {
    if (window.innerWidth > 1024) {
      return;
    }

    console.log(this.totalPages().length);
    console.log(this.currentPage());

    if (this.currentPage() === this.totalPages().length) {
      return;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
      this.nextPage();
    }
  }

  paginationService = inject(PaginationService);

  totalPages = computed(() => {
    return this.paginationService.allPages();
  });

  currentPage = computed(() => {
    return this.paginationService.currentPage();
  });
  tasksPerPage = computed(() => {
    return this.paginationService.itemsPerPage();
  });
  previousPage() {
    this.paginationService.previousPage();
    console.log('previous page');
    this.projectFacade
      .getProjectTasksWithRange(
        this.projectId(),
        (this.currentPage() - 1) * this.tasksPerPage(),
        this.tasksPerPage(),
      )
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.tasks.set(value.projects);
          this.allTasks.set(Number(value.totalProjects!));
        },
      });
  }
  nextPage() {
    console.log(this.currentPage());
    console.log(this.totalPages());

    if (this.currentPage() === this.totalPages().at(-1)) {
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
          this.allTasks.set(Number(value.totalProjects!));
          if (window.innerWidth >= 1024) {
            this.tasks.set(value.projects);
          } else {
            this.tasks.update(v => [...v, ...value.projects]);
          }
        },
      });
  }

  setModalStatus(item: Task) {
    this.isModalOpened.update(v => !v);
    this.selectedItem.set(item);
  }

  close() {
    this.isModalOpened.set(false);
  }
  getNameInitials(val: string) {
    return getNameInitials(val);
  }

  formatDate(val: string) {
    const formatted = new Date(val).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formatted;
  }
}
