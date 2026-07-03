import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubmitButtonComponent } from '../../auth/components/submit-button/submit-button.component';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule, SubmitButtonComponent],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
})
export class AddProjectComponent {
  fb = inject(FormBuilder);

  addProjectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });
  getControl(name: string) {
    return this.addProjectForm.get(name);
  }
}
