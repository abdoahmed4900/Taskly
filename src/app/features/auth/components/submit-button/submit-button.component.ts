import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css',
})
export class SubmitButtonComponent {
  buttonClass = input('');
  isButtonDisabled = input<boolean>();
  isLoading = model<boolean>(false);
}
