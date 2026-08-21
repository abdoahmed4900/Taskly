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
  searchQuery = model<string>('');

  @HostListener('window:scroll', [])
  getMoreTasks() {
    if (window.innerWidth > 1024) {
      return;
    }

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
          this.tasks.set(value.projects);
          this.allTasks.set(Number(value.totalProjects!));
        },
      });
  }
  nextPage() {
    if (this.currentPage() === this.totalPages().at(-1)) {
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
    this.selectedItem.set(item);
    this.isModalOpened.update(v => !v);
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
