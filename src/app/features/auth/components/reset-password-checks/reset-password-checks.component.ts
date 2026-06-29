import { Component, OnDestroy, computed, model, output } from '@angular/core';
import { CheckPasswordValidComponent } from '../check-password-valid/check-password-valid.component';
import { CheckPasswordInvalidComponent } from '../check-password-invalid/check-password-invalid.component';
import { Subject } from 'rxjs';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-reset-password-checks',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './reset-password-checks.component.html',
  styleUrl: './reset-password-checks.component.css',
})
export class ResetPasswordChecksComponent implements OnDestroy {
  passwordFirstCheck = computed(() => {
    return this.password().length >= 8 && this.password().length <= 64;
  });
  passwordSecondCheck = computed(() => {
    return /[A-Z]/.test(this.password());
  });
  passwordThirdCheck = computed(() => /[a-z]/.test(this.password()));
  passwordFourthCheck = computed(() => /[1-9]/.test(this.password()));
  passwordFifthCheck = computed(() => /[^a-zA-Z0-9_ ]/.test(this.password()));
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
  passwordFourthCheckComponent = computed(() => {
    return this.isPasswordCheckCorrect(this.passwordFourthCheck());
  });
  passwordFifthCheckComponent = computed(() => {
    return this.isPasswordCheckCorrect(this.passwordFifthCheck());
  });

  isPasswordStrong = computed(() => {
    this.setPasswordStrongOutPut.emit(
      this.passwordFirstCheck() &&
        this.passwordSecondCheck() &&
        this.passwordThirdCheck() &&
        this.passwordFourthCheck() &&
        this.passwordFifthCheck(),
    );
    return (
      this.passwordFirstCheck() &&
      this.passwordSecondCheck() &&
      this.passwordThirdCheck() &&
      this.passwordFourthCheck() &&
      this.passwordFifthCheck()
    );
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
