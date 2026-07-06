import { ProjectFacade } from './../facade/project.facade';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../../auth/components/submit-button/submit-button.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule, SubmitButtonComponent],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
})
export class AddProjectComponent implements OnDestroy {
  fb = inject(FormBuilder);
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();

  addProjectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });
  getControl(name: string) {
    return this.addProjectForm.get(name);
  }

  addNewProject() {
    this.projectFacade
      .addNewProject({
        name: this.getControl('name')?.value,
        description: this.getControl('description')?.value ?? '',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('project added successfully!');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
