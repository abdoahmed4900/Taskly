import { Component, OnDestroy, computed, model, output } from '@angular/core';
import { CheckPasswordValidComponent } from '../../../components/check-password-valid/check-password-valid.component';
import { CheckPasswordInvalidComponent } from '../../../components/check-password-invalid/check-password-invalid.component';
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

  components = [
    computed(() =>
      this.passwordFirstCheck() ? CheckPasswordValidComponent : CheckPasswordInvalidComponent,
    ),

    computed(() =>
      this.passwordSecondCheck() ? CheckPasswordValidComponent : CheckPasswordInvalidComponent,
    ),

    computed(() =>
      this.passwordThirdCheck() ? CheckPasswordValidComponent : CheckPasswordInvalidComponent,
    ),

    computed(() =>
      this.passwordFourthCheck() ? CheckPasswordValidComponent : CheckPasswordInvalidComponent,
    ),

    computed(() =>
      this.passwordFifthCheck() ? CheckPasswordValidComponent : CheckPasswordInvalidComponent,
    ),

    computed(() =>
      this.passwordSecondCheck() && this.passwordThirdCheck()
        ? CheckPasswordValidComponent
        : CheckPasswordInvalidComponent,
    ),
  ];

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
    return check;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
