import { ProjectFacade } from './../facade/project.facade';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../../auth/components/submit-button/submit-button.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/service/toast.service';
import { FormFieldComponent } from '../../auth/components/form-field/form-field.component';
import { DescriptionInputComponent } from './components/description-input/description-input.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    FormFieldComponent,
    DescriptionInputComponent,
    RouterLink,
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
})
export class AddProjectComponent implements OnDestroy {
  fb = inject(FormBuilder);
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();
  toastService = inject(ToastService);

  addProjectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });
  getControl(name: string) {
    return this.addProjectForm.get(name) as FormControl;
  }
  isLoading = signal<boolean>(false);
  router = inject(Router);

  addNewProject() {
    this.isLoading.set(true);
    if (this.addProjectForm.valid) {
      this.projectFacade
        .addNewProject({
          name: this.getControl('name')?.value,
          description: this.getControl('description')?.value ?? '',
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.addProjectForm.reset();
            this.toastService.success('Project added successfully!');
            this.router.navigate(['/projects']);
          },
          error: () => {
            this.isLoading.set(false);
            this.toastService.error('Failed to add project. Please try again.');
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
