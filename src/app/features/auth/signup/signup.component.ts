import { AuthFacade } from '../facade/auth.facade';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  doesControlIncludeNumber,
  doesControlIncludeSpecialCharacter,
  doesControlIncludeWhiteSpace,
  passwordMatchValidator,
} from '../../../shared/utils';
import { CheckPasswordInvalidComponent } from '../components/check-password-invalid/check-password-invalid.component';
import { CheckPasswordValidComponent } from '../components/check-password-valid/check-password-valid.component';
import { Subject, takeUntil } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PasswordVisibilityIcon } from '../components/password-visibility-icon/password-visibility-icon';
import { Router, RouterLink } from '@angular/router';
import { PasswordChecksComponent } from '../components/password-checks/password-checks.component';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordVisibilityIcon, RouterLink, PasswordChecksComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  destroy$ = new Subject<void>();
  authFacade = inject(AuthFacade);
  isPasswordVisible = signal(false);
  isPasswordStrong = signal(false);

  setPasswordVisiblity(value: boolean) {
    this.isPasswordVisible.set(value);
  }
  ngOnInit(): void {
    this.trackPasswordChecks();
  }

  setPasswordStrong(value: boolean) {
    this.isPasswordStrong.set(value);
  }

  registerForm = this.fb.group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          this.doesControlNotIncludeSpecialCharacter(),
          this.doesControlNotIncludeNumber(),
          this.hasControlConsecutiveSpaces(),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(64),
          doesControlIncludeWhiteSpace(),
          doesControlIncludeSpecialCharacter(),
          doesControlIncludeNumber(),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      jobTitle: ['', []],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') },
  );

  passwordFirstCheck = signal(false);
  passwordSecondCheck = signal(false);
  passwordThirdCheck = signal(false);
  router = inject(Router);
  private trackPasswordChecks() {
    this.getControl('password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.passwordFirstCheck.set(value.length >= 8);
          this.passwordSecondCheck.set(
            /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value),
          );
          this.passwordThirdCheck.set(/[^a-zA-Z0-9]/.test(value));
        },
      });
  }

  isPasswordCheckCorrect(check: boolean) {
    return check ? CheckPasswordValidComponent : CheckPasswordInvalidComponent;
  }
  register() {
    if (
      this.registerForm.valid &&
      this.passwordFirstCheck() &&
      this.passwordSecondCheck() &&
      this.passwordThirdCheck()
    ) {
      this.authFacade
        .registerUser({
          email: this.getControl('email')?.value,
          password: this.getControl('password')?.value,
          data: {
            jobTitle: this.getControl('jobTitle')?.value ?? '',
            name: this.getControl('username')?.value,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/', { replaceUrl: true });
          },
        });
    }
  }

  getControl(controlName: string): AbstractControl | null {
    return this.registerForm.get(controlName);
  }

  hasControlConsecutiveSpaces(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value ?? '';

      if (value && value.includes('  ')) {
        control.setErrors({ ...control.errors, consecutiveSpaces: true });
        return control.errors;
      } else {
        control.setErrors({ ...control.errors, consecutiveSpaces: null });
      }
      return null;
    };
  }

  doesControlNotIncludeNumber(): ValidatorFn {
    return (control: AbstractControl) => {
      const value: string = control.value ?? '';
      if (value && /[0-9]/.test(value)) {
        control.setErrors({ ...control?.errors, noNumber: true });
        return control.errors;
      } else {
        control?.setErrors({ ...control?.errors, noNumber: null });
      }
      return null;
    };
  }

  doesControlNotIncludeSpecialCharacter() {
    return (control: AbstractControl) => {
      const value: string = control.value;
      if (value && /[^a-zA-Z0-9_ ]/.test(value)) {
        control.setErrors({ ...control?.errors, specialChar: true });
        return control.errors;
      } else {
        control?.setErrors({ ...control?.errors, specialChar: null });
      }
      return null;
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
