import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  controlMaxLengthValidator,
  controlMinLengthValidator,
  doesControlIncludeNumber,
  doesControlIncludeSpecialCharacter,
  doesControlIncludeWhiteSpace,
  passwordMatchValidator,
} from '../../../shared/utils';
import { PasswordVisibilityIcon } from '../components/password-visibility-icon/password-visibility-icon';
import { ResetPasswordChecksComponent } from './components/reset-password-checks/reset-password-checks.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthFacade } from '../facade/auth.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/service/toast.service';
import { FormFieldComponent } from '../components/form-field/form-field.component';
import { SubmitButtonComponent } from '../components/submit-button/submit-button.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordVisibilityIcon,
    ResetPasswordChecksComponent,
    FormFieldComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  password = signal('');
  isPasswordVisible = signal(false);
  destroy$ = new Subject<void>();
  authFacade = inject(AuthFacade);
  newAccessToken = '';
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  isLoading = signal(false);
  toastService = inject(ToastService);

  resetPasswordForm = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          controlMinLengthValidator(8),
          controlMaxLengthValidator(64),
          doesControlIncludeWhiteSpace(),
          doesControlIncludeSpecialCharacter(),
          doesControlIncludeNumber(),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') },
  );

  ngOnInit(): void {
    this.resetPasswordForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.password.set(val.password ?? '');
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.isLoading.set(true);
      this.authFacade
        .resetPassword(this.password())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.toastService.success(
              'Your password has been updated successfully. You can now log in',
            );
            setTimeout(() => {
              this.authFacade.authDomainService.clearUserExpriedSession();
              this.router.navigateByUrl('/login', { replaceUrl: true });
            }, 3000);
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
    }
  }

  getControl(controlName: string) {
    return this.resetPasswordForm.get(controlName) as FormControl;
  }

  setPasswordVisiblity(value: boolean) {
    this.isPasswordVisible.set(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
