import { Task } from './../../../../tasks/task';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { ClickOutsideDirective } from '../../../../../core/components/click-outside.directive';
import { TaskStatus } from '../../../../tasks/task';
import { getNameInitials } from '../../../../../shared/utils';
import { TaskFacade } from '../../../../tasks/facade/task.facade';
import { ToastService } from '../../../../../shared/service/toast.service';
import { FormsModule } from '@angular/forms';
import { MembersFacade } from '../../../../members/facade/members.facade';
import { Subject, takeUntil } from 'rxjs';
import { Member } from '../../../../members/member';
import { Epic } from '../../../../epics/epic';
import { EpicsFacade } from '../../../../epics/facade/epics.facade';

@Component({
  selector: 'app-task-details-modal',
  standalone: true,
  imports: [ClickOutsideDirective, FormsModule],
  templateUrl: './task-modal.component.html',
})
export class TaskDetailsModalComponent implements OnDestroy, OnInit {
  taskFacade = inject(TaskFacade);
  epicsFacade = inject(EpicsFacade);
  memberFacade = inject(MembersFacade);
  selectedItem = model<Task>();
  destroy$ = new Subject<void>();
  members = signal<Member[]>([]);
  epics = signal<Epic[]>([]);

  previousTaskValue!: Task;
  toastService = inject(ToastService);
  today = new Date().toISOString().split('T')[0];
  ngOnInit() {
    this.previousTaskValue = { ...this.selectedItem()! };

    this.getProjectMembers(this.selectedItem()!.projectId!);
    this.getProjectEpics(this.selectedItem()!.projectId!);
  }
  isAssigneeOpen = signal(false);
  selectedMember = computed(
    () => this.members().find(m => m.userId === this.selectedItem()?.assignee?.id) ?? null,
  );

  selectAssignee(item: Member | null) {
    this.updateTaskAssignee(item?.userId ?? null);
  }

  getProjectMembers(projectId: string) {
    return this.memberFacade
      .getProjectMembers(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(members => {
        this.members.set(members);
      });
  }
  getProjectEpics(projectId: string) {
    return this.epicsFacade
      .getProjectEpics(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(epics => {
        this.epics.set(epics);
      });
  }

  updateTaskTitle(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length < 3) {
      this.selectedItem()!.title = this.previousTaskValue.title ?? '';
      this.toastService.error('Task title must be at least 3 characters long');
      return;
    }
    if (this.previousTaskValue.title?.trim() != this.selectedItem()!.title?.trim()) {
      this.taskFacade
        .updateTask(this.selectedItem()!.id!, { title: value })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.previousTaskValue.title = value;
            this.toastService.success('Task title updated successfully');
            this.close();
          },
          error: () => {
            this.selectedItem()!.title = this.previousTaskValue.title ?? '';
            this.toastService.error('Failed to update task title');
            this.close();
          },
        });
    }
  }
  updateTaskDescription(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value;

    if (
      (this.previousTaskValue.description?.trim() ?? '') !=
      (this.selectedItem()!.description?.trim() ?? '')
    ) {
      this.taskFacade
        .updateTask(this.selectedItem()!.id!, { description: value })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.previousTaskValue.description = value;
            this.toastService.success('Task description updated successfully');
            this.close();
          },
          error: () => {
            this.selectedItem()!.description = this.previousTaskValue.description ?? '';
            this.toastService.error('Failed to update task description');
            this.close();
          },
        });
    }
  }
  updateTaskAssignee(id: string | null) {
    if (id != this.selectedItem()!.assignee?.id) {
      this.taskFacade
        .updateTask(this.selectedItem()!.id!, { assignee_id: id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.selectedItem()!.assignee!.id = id!;
            this.previousTaskValue.assignee!.id = id!;
            this.toastService.success('Task assignee updated successfully');
            this.close();
          },
          error: () => {
            this.selectedItem()!.assigneeId = this.previousTaskValue.assigneeId ?? '';
            this.toastService.error('Failed to update task assignee');
            this.close();
          },
        });
    }
  }
  updateTaskDueDate(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value != this.selectedItem()?.dueDate) {
      this.taskFacade
        .updateTask(this.selectedItem()!.id!, {
          due_date:
            (event.target as HTMLInputElement).value == ''
              ? null
              : (event.target as HTMLInputElement).value,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.selectedItem()!.dueDate = value;
            this.previousTaskValue.dueDate = value;
            this.toastService.success('Task due date updated successfully');
            this.close();
          },
          error: () => {
            this.selectedItem()!.dueDate = this.previousTaskValue.dueDate ?? '';
            this.toastService.error('Failed to update task due date');
            this.close();
          },
        });
    }
  }
  updateTaskStatus(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (this.selectedItem()?.status != value) {
      this.taskFacade
        .updateTask(this.selectedItem()!.id!, {
          status: (event.target as HTMLInputElement).value,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.selectedItem()!.status = value as TaskStatus;
            this.previousTaskValue.status = value as TaskStatus;
            this.toastService.success('Task status updated successfully');
            this.close();
          },
          error: () => {
            this.selectedItem()!.status = this.previousTaskValue.status ?? '';
            this.toastService.error('Failed to update task due date');
            this.close();
          },
        });
    }
  }
  updateTaskEpic(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value != this.selectedItem()?.epic?.id) {
      this.taskFacade
        .updateTask(this.selectedItem()!.id!, {
          epic_id: (event.target as HTMLInputElement).value,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.selectedItem()!.epicId = value;
            this.previousTaskValue.epicId = value;
            this.toastService.success('Task epic updated successfully');
            this.close();
          },
          error: () => {
            this.selectedItem()!.epicId = this.previousTaskValue.epicId ?? '';
            this.toastService.error('Failed to update task epic');
            this.close();
          },
        });
    }
  }
  isModalOpened = output<boolean>();
  startY = 0;
  statusOptions = [
    TaskStatus.TODO,
    TaskStatus.INPROGRESS,
    TaskStatus.DONE,
    TaskStatus.BLOCKED,
    TaskStatus.INREVIEW,
    TaskStatus.READYFORQA,
    TaskStatus.REOPENED,
    TaskStatus.READYFORPRODUCTION,
  ];

  onTouchStart(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent) {
    const currentY = event.touches[0].clientY;

    if (currentY - this.startY > 120) {
      this.close();
    }
  }

  onTouchEnd() {
    this.startY = 0;
  }
  close() {
    this.isModalOpened.emit(false);
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
