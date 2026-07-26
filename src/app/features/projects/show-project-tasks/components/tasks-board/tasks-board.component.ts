import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Task, TaskStatus } from '../../../../tasks/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [],
  templateUrl: './tasks-board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksBoardComponent {
  tasks = input<Task[]>([]);
  projectId = input<string>('');
  router = inject(Router);

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
    let initials = '';
    const words = val.split(' ');

    if (words.length > 1) {
      words.map(word => {
        initials += word.charAt(0);
      });
    } else {
      initials = words[0].substring(0, 2);
    }

    return initials;
  }

  goToAddTask(status: string) {
    this.router.navigate(['/project', this.projectId(), 'tasks', 'new'], {
      state: {
        selectedStatus: status,
      },
    });
  }
}
