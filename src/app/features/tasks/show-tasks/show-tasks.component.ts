import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Task } from '../task';
import { MembersFacade } from '../../members/facade/members.facade';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-tasks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowTasksComponent implements OnInit {
  currentTasks = input<Task[]>([]);
  membersFacade = inject(MembersFacade);
  destroy$ = new Subject<void>();
  assigneeNames = signal<string[]>([]);
  activatedRoute = inject(ActivatedRoute);
  projectId = signal('');
  today = new Date().toISOString();
  ngOnInit(): void {
    this.projectId.set(this.activatedRoute.snapshot.url[1].toString());
  }
  getMembersName() {
    this.currentTasks().map(task => {
      this.membersFacade
        .getProjectMember(task.projectId, task.assigneeId!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: value => {
            this.assigneeNames.update(val => [...val, value!.name!]);
          },
        });
    });
  }

  getInitials(name: string) {
    let val = '';
    const words = name.split(' ');
    if (words.length > 1) {
      words.map(word => {
        val += word.charAt(0);
      });
    } else {
      val = words[0].substring(0, 2);
    }

    return val;
  }
}
