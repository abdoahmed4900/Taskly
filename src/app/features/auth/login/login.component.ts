import { AuthFacade } from './../facade/auth.facade';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordVisibilityIcon } from '../components/password-visibility-icon/password-visibility-icon';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SubmitButtonComponent } from '../components/submit-button/submit-button.component';
import { ToastService } from '../../../shared/service/toast.service';
import { controlMinLengthValidator, emailValidator } from '../../../shared/utils';
import { FormFieldComponent } from '../components/form-field/form-field.component';
import { SignUpSectionComponent } from './components/sign-up-section/sign-up-section.component';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PasswordVisibilityIcon,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    SubmitButtonComponent,
    FormFieldComponent,
    SignUpSectionComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  fb = inject(FormBuilder);
  authFacade = inject(AuthFacade);
  destroy$ = new Subject<void>();
  toastService = inject(ToastService);
  isPasswordVisible = signal(false);
  loginForm = this.fb.group({
    email: ['', [Validators.required, emailValidator()]],
    password: ['', [Validators.required, controlMinLengthValidator(8)]],
  });
  router = inject(Router);
  rememberUserForMonth = signal(false);
  isLoading = signal(false);
  getControl(controlName: string) {
    return this.loginForm.get(controlName) as FormControl;
  }

  setPasswordVisiblity(value: boolean) {
    this.isPasswordVisible.set(value);
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
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
            this.isLoading.set(false);
            this.toastService.success('Logged in successfully');
            this.router.navigateByUrl('/project', { replaceUrl: true });
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
