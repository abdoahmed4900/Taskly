import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Task } from '../../../../tasks/task';
import { RouterLink } from '@angular/router';
import { TaskFacade } from '../../../../tasks/facade/task.facade';
import { Subject } from 'rxjs';
import { getNameInitials } from '../../../../../shared/utils';
import { TaskDetailsModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [RouterLink, TaskDetailsModalComponent],
  templateUrl: './tasks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  tasks = input<Task[]>([]);
  projectId = input<string>('');
  isModalOpened = signal(false);
  selectedItem = signal<Task>({});
  taskFacade = inject(TaskFacade);
  destroy$ = new Subject<void>();

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
