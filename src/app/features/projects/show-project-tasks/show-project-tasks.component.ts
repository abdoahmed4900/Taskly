import { Component, OnInit, inject, signal } from '@angular/core';
import { Project } from '../model/project';
import { ProjectFacade } from '../facade/project.facade';
import { Subject, takeUntil } from 'rxjs';
import { Task, TaskStatus } from '../../tasks/task';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-project-tasks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-project-tasks.component.html',
})
export class ShowProjectTasksComponent implements OnInit {
  today = new Date();
  getDate(date: string) {
    const due = new Date(date);

    due.setHours(0, 0, 0, 0);
    this.today.setHours(0, 0, 0, 0);

    if (due.getTime() === this.today.getTime()) {
      return 'Today';
    }

    if (due.getUTCDate() > this.today.getUTCDate()) {
      return 'Overdue';
    }

    return `${new Date(date).toLocaleString('default', { month: 'short' })} ${new Date(date).getDay()}`;
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
          console.log(value);

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
    console.log(words);

    if (words.length > 1) {
      words.map(word => {
        initials += word.charAt(0);
        console.log(`val + ${val}`);
      });
    } else {
      initials = words[0].substring(0, 2);
    }
    console.log(val);

    return initials;
  }

  goToAddTask(status: string) {
    this.router.navigate(['/project', this.project().id, 'tasks', 'new'], {
      state: {
        selectedStatus: status,
      },
    });
  }
}
