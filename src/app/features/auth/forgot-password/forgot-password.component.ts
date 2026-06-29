import { Component, ElementRef, OnDestroy, inject, signal, viewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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
      this.buttonElement()!.nativeElement.disabled = true;
      setTimeout(() => {
        this.authFacade
          .sendResetPasswordEmail(this.getControl('email')!.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.buttonElement()!.nativeElement.disabled = false;
              console.log('email sent successfully!');
              this.setResetEmailInterval();
              this.trials.update(v => v - 1);
            },
          });
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
