import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Task, TaskStatus } from '../../../../tasks/task';
import { Router } from '@angular/router';
import { getNameInitials } from '../../../../../shared/utils';
import { TaskDetailsModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [TaskDetailsModalComponent],
  templateUrl: './tasks-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksBoardComponent {
  tasks = input<Task[]>([]);
  projectId = input<string>('');
  router = inject(Router);
  isModalOpened = signal(false);
  selectedItem = signal<Task>({});

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
}
