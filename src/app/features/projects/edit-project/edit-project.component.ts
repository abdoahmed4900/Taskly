import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/service/toast.service';
import { ProjectFacade } from '../facade/project.facade';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { FormFieldComponent } from '../../auth/components/form-field/form-field.component';
import { DescriptionInputComponent } from '../add-project/components/description-input/description-input.component';
import { SubmitButtonComponent } from '../../auth/components/submit-button/submit-button.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    DescriptionInputComponent,
    SubmitButtonComponent,
    RouterLink,
  ],
  templateUrl: './edit-project.component.html',
})
export class EditProjectComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  editProjectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });
  isLoading = signal<boolean>(false);
  id = signal('');
  getControl(name: string) {
    return this.editProjectForm.get(name) as FormControl;
  }
  ngOnInit(): void {
    this.route.url
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          this.id.set(params[1].path);
          return this.projectFacade.getProject(this.id());
        }),
      )
      .subscribe({
        next: value => {
          this.editProjectForm.controls.name.setValue(value!.name!);
          this.editProjectForm.controls.description.setValue(value!.description!);
        },
        error: () => {
          this.toastService.error('Error Loading Project!');
          this.router.navigateByUrl('/project');
        },
      });
  }
  private loadProject() {
    this.projectFacade
      .getProject(this.id())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.editProjectForm.controls.name.setValue(value!.name!);
          this.editProjectForm.controls.description.setValue(value!.description!);
        },
        error: () => {
          this.toastService.error('Error Loading Project!');
          this.router.navigateByUrl('/project');
        },
      });
  }

  editProject() {
    if (this.editProjectForm.valid) {
      this.isLoading.set(true);
      this.projectFacade
        .editProject(this.id(), {
          name: this.editProjectForm.controls.name.value!,
          description: this.editProjectForm.controls.description.value!,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.toastService.success('Project Edited Successfully!');
          },
          error: () => {
            this.isLoading.set(false);
            this.toastService.error('Error Editing Project!');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
