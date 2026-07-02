import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  doesControlIncludeNumber,
  doesControlIncludeSpecialCharacter,
  doesControlIncludeWhiteSpace,
  passwordMatchValidator,
} from '../../../shared/utils';
import { PasswordVisibilityIcon } from '../components/password-visibility-icon/password-visibility-icon';
import { ResetPasswordChecksComponent } from '../components/reset-password-checks/reset-password-checks.component';
import { Subject, takeUntil } from 'rxjs';
import { AuthFacade } from '../facade/auth.facade';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordVisibilityIcon, ResetPasswordChecksComponent],
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
  token = '';
  refreshToken = '';

  resetPasswordForm = this.fb.group(
    {
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
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') },
  );

  ngOnInit(): void {
    this.resetPasswordForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.password.set(val.password ?? '');
      console.log(`password: ${this.password()}`);
    });
    this.checkLinkValidity();
  }

  private checkLinkValidity() {
    this.activatedRoute.fragment.pipe(takeUntil(this.destroy$)).subscribe(val => {
      const arr = JSON.stringify(val).split('&');
      console.log(arr[0].split('=')[1]);
      console.log(arr[3].split('=')[1]);
      console.log(arr);
      if (arr[6].split('=')[1].substring(0, 8) != 'recovery') {
        console.log('Invalid or expired reset link.');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      } else {
        this.token = arr[0].split('=')[1];
        this.refreshToken = arr[3].split('=')[1];
      }
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authFacade
        .resetPassword(this.password())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('password updated');
          },
        });
    }
  }

  getControl(controlName: string) {
    return this.resetPasswordForm.get(controlName);
  }

  setPasswordVisiblity(value: boolean) {
    this.isPasswordVisible.set(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
