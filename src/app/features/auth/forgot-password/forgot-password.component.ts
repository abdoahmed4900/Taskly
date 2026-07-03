import { Component, ElementRef, OnDestroy, inject, signal, viewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';
import { SubmitButtonComponent } from '../components/submit-button/submit-button.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SubmitButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnDestroy {
  fb = inject(FormBuilder);
  resendTime = signal(0);
  resendTimeText = signal(`Resend in 05:00`);
  interval!: number;
  authFacade = inject(AuthFacade);
  destroy$ = new Subject<void>();
  trials = signal(3);
  buttonElement = viewChild<ElementRef<HTMLButtonElement>>('submitButton');
  isLoading = signal(false);
  isReqSent = signal(false);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  private setResetEmailInterval() {
    this.resendTime.set(300);
    this.interval = setInterval(() => {
      this.resendTime.update(v => v - 1);
      if (this.resendTime() > 0) {
        const minutes = Math.floor(this.resendTime() / 60);
        const seconds = Math.floor(this.resendTime() % 60);
        if (seconds < 10 && seconds >= 0) {
          this.resendTimeText.set(`Resend in 0${minutes}:0${seconds}`);
        } else {
          this.resendTimeText.set(`Resend in 0${minutes}:${seconds}`);
        }
      } else {
        this.resendTimeText.set('Resend in 05:00');
        clearInterval(this.interval);
      }
    }, 1000);
  }

  getControl(controlName: string): AbstractControl | null {
    return this.forgotPasswordForm.get(controlName);
  }

  sendEmail() {
    if (this.forgotPasswordForm.valid && this.resendTime() == 0 && this.trials() > 0) {
      this.isLoading.set(true);
      this.authFacade
        .sendResetPasswordEmail(this.getControl('email')!.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('email sent successfully!');
            this.isLoading.set(false);
            this.isReqSent.set(true);
            setTimeout(() => {
              this.isReqSent.set(false);
            }, 2000);
            this.setResetEmailInterval();
            this.trials.update(v => v - 1);
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
