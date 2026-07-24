import { AuthFacade } from './../../../../auth/facade/auth.facade';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ModalComponent } from '../../../components/modal/modal.component';
import { Assignee, Epic } from '../../../epic';
import { EpicsFacade } from '../../../facade/epics.facade';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MembersFacade } from '../../../../members/facade/members.facade';
import { Subject, takeUntil } from 'rxjs';
import { Member } from '../../../../members/member';
import { ToastService } from '../../../../../shared/service/toast.service';
import { Project } from '../../../../projects/model/project';
import { ShowTasksComponent } from '../../../../tasks/show-tasks/show-tasks.component';
import { TaskFacade } from '../../../../tasks/facade/task.facade';
import { Task } from '../../../../tasks/task';
@Component({
  selector: 'app-project-epic-modal-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, ReactiveFormsModule, ShowTasksComponent, RouterLink],
  templateUrl: './epic.modal.component.html',
})
export class ProjectEpicModalComponent implements OnInit, OnDestroy {
  isModalOpen = model(false);
  fb = inject(FormBuilder);
  authFacade = inject(AuthFacade);
  epic = input<Epic>();
  currentEpic = computed(() => {
    return {
      title: this.epic()!.title ?? '',
      description: this.epic()!.description ?? '',
      assignee: this.epic()!.assigneeId ?? '',
      deadline: this.epic()!.deadline ?? '',
    };
  });

  editEpic = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', []],
    assignee: ['', []],
    deadline: ['', []],
  });
  epicsFacade = inject(EpicsFacade);
  membersFacade = inject(MembersFacade);
  tasksFacade = inject(TaskFacade);
  toastService = inject(ToastService);
  modalStatusEmitter = output<boolean>();
  members = signal<Member[]>([]);
  destroy$ = new Subject<void>();
  activatedRoute = inject(ActivatedRoute);
  tasks = signal<Task[]>([]);
  taskAssignee = signal<Assignee[]>([]);
  router = inject(Router);
  projectId = computed(() => {
    const project = JSON.parse(sessionStorage.getItem('project')!) as Project;
    const projectId = project.id ?? this.activatedRoute.snapshot.url[1].toString();
    return projectId;
  });
  today = new Date().toISOString().split('T')[0];

  initials = computed(() => {
    if (this.epic()?.createdBy?.name) {
      let val = '';
      const words = this.epic()!.createdBy!.name!.split(' ');
      if (words.length > 1) {
        words.map(word => {
          val += word.charAt(0);
        });
      } else {
        val = words[0].substring(0, 2);
      }

      return val;
    }
    return '';
  });

  ngOnInit(): void {
    this.editEpic.reset({
      title: this.epic()!.title ?? '',
      description: this.epic()!.description ?? '',
      assignee: this.epic()!.assigneeId ?? '',
      deadline: this.epic()!.deadline ?? '',
    });
    this.getProjectMembers();
    this.getEpicTasks();
  }

  goToNewTask() {
    console.log(this.epic()!.id);

    sessionStorage.setItem('epicId', this.epic()!.id!);
    this.router.navigate(['/project', this.projectId(), 'tasks', 'new']);
  }

  private getEpicTasks() {
    this.tasksFacade
      .getEpicTasks(this.epic()!.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          console.log(value);
          sessionStorage.setItem('epicId', this.epic()!.id!);
          this.tasks.set(value);
        },
      });
  }

  private getProjectMembers() {
    this.membersFacade
      .getProjectMembers(this.projectId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.members.set(value);
        },
        error: () => {
          this.members.set([]);
          this.toastService.error('Failed to get project members!');
        },
      });
  }

  updateEpic() {
    if (this.editEpic.valid) {
      const newEpic: Epic = this.setUpNewEpic();
      this.epicsFacade
        .updateEpic(newEpic)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isModalOpen.set(false);
            this.modalStatusEmitter.emit(false);
            this.toastService.success('Project Update successfully!');
          },
          error: () => {
            this.toastService.error('Project Update Failed, try later!');
          },
        });
    }
  }

  private setUpNewEpic() {
    const newEpic: Epic = {};
    if (this.getControl('description').value.length > 0) {
      newEpic.description = this.getControl('description').value;
    }
    if (this.getControl('deadline').value.length > 0) {
      newEpic.deadline = this.getControl('deadline').value;
    }
    if (this.getControl('assignee').value && this.getControl('assignee').value != 'unassigned') {
      newEpic.assigneeId = this.getControl('assignee').value;
    }
    newEpic.title = this.getControl('title').value;
    newEpic.id = this.epic()?.id;
    return newEpic;
  }

  getControl(control: string) {
    return this.editEpic.get(control) as FormControl;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
