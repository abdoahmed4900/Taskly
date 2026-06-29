import { Component, output } from '@angular/core';

@Component({
  selector: 'app-password-visibility-icon',
  standalone: true,
  templateUrl: './password-visibility-icon.html',
  styleUrl: './password-visibility-icon.scss',
})
export class PasswordVisibilityIcon {
  isPasswordVisible = false;

  visibilityChanged = output<boolean>();

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.visibilityChanged.emit(this.isPasswordVisible);
  }
}
