import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../shared/service/toast.service';
import { ProjectFacade } from '../facade/project.facade';
import { Subject } from 'rxjs';
import { FormFieldComponent } from '../../auth/components/form-field/form-field.component';
import { DescriptionInputComponent } from '../add-project/components/description-input/description-input.component';
import { SubmitButtonComponent } from '../../auth/components/submit-button/submit-button.component';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    DescriptionInputComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './edit-project.component.html',
})
export class EditProjectComponent {
  fb = inject(FormBuilder);
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();
  toastService = inject(ToastService);

  editProjectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });
  getControl(name: string) {
    return this.editProjectForm.get(name) as FormControl;
  }
  isLoading = signal<boolean>(false);
  editProject() {
    console.log('');
  }
}
