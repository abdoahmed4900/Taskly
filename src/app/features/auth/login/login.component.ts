import { AuthFacade } from './../facade/auth.facade';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordVisibilityIcon } from '../components/password-visibility-icon/password-visibility-icon';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PasswordVisibilityIcon, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  fb = inject(FormBuilder);
  authFacade = inject(AuthFacade);
  destroy$ = new Subject<void>();
  isPasswordVisible = signal(false);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  router = inject(Router);
  rememberUserForMonth = signal(false);
  getControl(controlName: string): AbstractControl | null {
    return this.loginForm.get(controlName);
  }

  setPasswordVisiblity(value: boolean) {
    this.isPasswordVisible.set(value);
  }

  login() {
    if (this.loginForm.valid) {
      this.authFacade
        .login(
          {
            email: this.getControl('email')!.value as string,
            password: this.getControl('password')!.value as string,
          },
          this.rememberUserForMonth(),
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(localStorage.getItem('name'));
            console.log(sessionStorage.getItem('name'));
            console.log(this.rememberUserForMonth());

            console.log('login is success');
            this.router.navigateByUrl('/project', { replaceUrl: true });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
