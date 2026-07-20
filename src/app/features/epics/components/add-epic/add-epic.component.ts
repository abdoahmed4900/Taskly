import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Project } from '../../../projects/model/project';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EpicsFacade } from '../../facade/epics.facade';
import { SubmitButtonComponent } from '../../../auth/components/submit-button/submit-button.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../../shared/service/toast.service';
import { ProjectFacade } from '../../../projects/facade/project.facade';

@Component({
  selector: 'app-add-epic',
  standalone: true,
  imports: [ReactiveFormsModule, SubmitButtonComponent],
  templateUrl: './add-epic.component.html',
  styleUrl: './add-epic.component.css',
})
export class AddEpicComponent implements OnInit, OnDestroy {
  router = inject(Router);
  fb = inject(FormBuilder);
  epicFacade = inject(EpicsFacade);
  projectFacade = inject(ProjectFacade);
  project = signal<Project>({});
  activatedRoute = inject(ActivatedRoute);
  destroy$ = new Subject<void>();
  addEpicForm = this.fb.group({
    title: ['', [Validators.minLength(3), Validators.required]],
    description: [''],
    assignee: [''],
    deadline: [''],
  });
  toastService = inject(ToastService);
  isLoading = signal(false);
  today = new Date().toISOString().split('T')[0];
  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.url[1].toString());
    if (history.state['project']) {
      this.project.set(history.state['project'] as Project);
    } else {
      this.project.set({
        id: this.activatedRoute.snapshot.url[1].toString(),
      });
      this.projectFacade
        .getProject(this.project().id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => {
          this.project.set({ ...value });
        });
    }
  }

  getControl(name: string) {
    return this.addEpicForm.get(name) as FormControl;
  }

  cancelEpicAdd() {
    this.router.navigateByUrl('/project');
  }

  addEpic() {
    if (this.addEpicForm.valid) {
      this.isLoading.set(true);
      this.epicFacade
        .addEpic({
          title: this.getControl('title').value ?? '',
          description: this.getControl('description').value ?? '',
          deadline: this.getControl('deadline').value ?? '',
          projectId: this.project().id,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('Epic Created Successfully!');
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
            this.toastService.success('Error while creating Epic');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
