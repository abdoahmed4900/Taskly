import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Task } from '../task';
import { MembersFacade } from '../../members/facade/members.facade';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getNameInitials } from '../../../shared/utils';

@Component({
  selector: 'app-show-epic-tasks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-epic-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowEpicTasksComponent implements OnInit {
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
        .getProjectMember(task.projectId!, task.assigneeId!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: value => {
            this.assigneeNames.update(val => [...val, value!.name!]);
          },
        });
    });
  }

  getInitials(name: string) {
    return getNameInitials(name);
  }
}
