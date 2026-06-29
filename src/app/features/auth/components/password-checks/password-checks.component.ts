import { NgComponentOutlet } from '@angular/common';
import { Component, OnDestroy, computed, model, output } from '@angular/core';
import { CheckPasswordValidComponent } from '../check-password-valid/check-password-valid.component';
import { CheckPasswordInvalidComponent } from '../check-password-invalid/check-password-invalid.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-password-checks',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './password-checks.component.html',
  styleUrl: './password-checks.component.css',
})
export class PasswordChecksComponent implements OnDestroy {
  passwordFirstCheck = computed(() => {
    return this.password().length >= 8;
  });
  passwordSecondCheck = computed(
    () =>
      /[a-z]/.test(this.password()) &&
      /[A-Z]/.test(this.password()) &&
      /[0-9]/.test(this.password()),
  );
  passwordThirdCheck = computed(() => {
    return /[^a-zA-Z0-9]/.test(this.password());
  });
  destroy$ = new Subject<void>();
  passwordFirstCheckComponent = computed(() => {
    return this.isPasswordCheckCorrect(this.passwordFirstCheck());
  });
  passwordSecondCheckComponent = computed(() => {
    return this.isPasswordCheckCorrect(this.passwordSecondCheck());
  });
  passwordThirdCheckComponent = computed(() => {
    return this.isPasswordCheckCorrect(this.passwordThirdCheck());
  });

  isPasswordStrong = computed(() => {
    this.setPasswordStrongOutPut.emit(
      this.passwordFirstCheck() && this.passwordSecondCheck() && this.passwordThirdCheck(),
    );
    return this.passwordFirstCheck() && this.passwordSecondCheck() && this.passwordThirdCheck();
  });

  password = model<string>('');

  setPasswordStrongOutPut = output<boolean>();

  isPasswordCheckCorrect(check: boolean) {
    return check ? CheckPasswordValidComponent : CheckPasswordInvalidComponent;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
