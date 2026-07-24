import { TaskFacade } from './../facade/task.facade';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../auth/components/form-field/form-field.component';
import { DescriptionInputComponent } from '../../projects/add-project/components/description-input/description-input.component';
import { SubmitButtonComponent } from '../../auth/components/submit-button/submit-button.component';
import { controlMaxLengthValidator, controlMinLengthValidator } from '../../../shared/utils';
import { EpicsFacade } from '../../epics/facade/epics.facade';
import { Project } from '../../projects/model/project';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Epic } from '../../epics/epic';
import { ToastService } from '../../../shared/service/toast.service';
import { Member } from '../../members/member';
import { MembersFacade } from '../../members/facade/members.facade';
import { Task, TaskStatus } from '../task';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    DescriptionInputComponent,
    SubmitButtonComponent,
    RouterLink,
  ],
  templateUrl: './add-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTaskComponent implements OnDestroy, OnInit {
  isLoading = signal(false);
  epicFacade = inject(EpicsFacade);
  membersFacade = inject(MembersFacade);
  activatedRoute = inject(ActivatedRoute);
  taskFacade = inject(TaskFacade);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);
  project = signal<Project>(JSON.parse(sessionStorage.getItem('project')!));
  destroy$ = new Subject<void>();
  epics = signal<Epic[]>([]);
  router = inject(Router);
  members = signal<Member[]>([]);
  taskStatus = signal<TaskStatus | ''>(TaskStatus.TODO);
  taskAssignee = signal('');
  ngOnInit(): void {
    this.addTaskForm.patchValue({
      epicId: sessionStorage.getItem('epicId'),
    });
    this.getProjectEpics();
  }

  addTaskForm = this.fb.group({
    title: [
      '',
      [Validators.required, controlMinLengthValidator(3), controlMaxLengthValidator(100)],
    ],
    assigneeId: ['', []],
    epicId: ['', []],
    dueDate: ['', []],
    description: ['', [controlMaxLengthValidator(500)]],
  });
  private getProjectEpics() {
    let projectId;
    if (this.project()) {
      projectId = this.project().id!;
    } else {
      projectId = this.activatedRoute.snapshot.url[1].toString();
    }
    this.epicFacade
      .getProjectEpics(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.epics.set(value);
        },
        error: () => {
          this.epics.set([]);
          this.toastService.error('Failed to get project epics, try later');
        },
      });
    this.membersFacade
      .getProjectMembers(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.members.set(value);
        },
        error: () => {
          this.toastService.error('Failed to get project members, try later');
          this.members.set([]);
        },
      });
  }

  getControl(name: string) {
    return this.addTaskForm.get(name) as FormControl;
  }
  addNewTask() {
    if (this.addTaskForm.valid) {
      const newTask = {
        projectId: this.project()!.id!,
        title: this.getControl('title').value,
      } as Task;
      if (this.getControl('epicId').value) {
        newTask.epicId = this.getControl('epicId').value;
      }
      if (this.taskAssignee() != '') {
        newTask.assigneeId = this.taskAssignee();
      }
      if (this.getControl('description').value != '') {
        newTask.description = this.getControl('description').value;
      }
      if (this.getControl('dueDate').value != '') {
        newTask.dueDate = this.getControl('dueDate').value;
      }
      if (this.getControl('dueDate').value != '') {
        newTask.dueDate = this.getControl('dueDate').value;
      }
      if (this.taskStatus() != '') {
        newTask.status = this.taskStatus();
      }
      this.isLoading.set(true);

      this.taskFacade
        .addTask(newTask)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/project', sessionStorage.getItem('epicId'), 'epics']);
            sessionStorage.removeItem('epicId');
            this.isLoading.set(false);
            this.toastService.success('Task Added Successfully!');
          },
          error: () => {
            this.isLoading.set(false);
            this.toastService.success('Task Add Failed, try later!');
          },
        });
    }
  }
  selectTaskStatus(event: Event) {
    const val = event.target as HTMLSelectElement;
    this.taskStatus.set(val.value as TaskStatus);
  }
  selectTaskAssignee(event: Event) {
    const val = event.target as HTMLSelectElement;
    this.taskAssignee.set(val.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
