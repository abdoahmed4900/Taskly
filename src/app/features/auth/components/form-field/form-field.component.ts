import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  type = input<string>('');
  placeholder = input<string>('');
  control = input<FormControl | null>();
  label = input<string>();
  controlName = input<string>('');
}
