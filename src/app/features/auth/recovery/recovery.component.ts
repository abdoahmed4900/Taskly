import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/service/toast.service';
import { AuthFacade } from '../facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  template: '',
})
export class RecoveryComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  toastService = inject(ToastService);
  activatedRoute = inject(ActivatedRoute);
  authFacade = inject(AuthFacade);
  token = '';
  refreshToken = '';
  destroy$ = new Subject<void>();

  ngOnInit() {
    this.checkLinkValidity();
  }
  private checkLinkValidity() {
    this.activatedRoute.fragment.pipe(takeUntil(this.destroy$)).subscribe(fragment => {
      if (!fragment) {
        this.router.navigate(['/login'], { replaceUrl: true });
        return;
      }

      const params = new URLSearchParams(fragment);

      const type = params.get('type');
      const token = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (type !== 'recovery' || !token || !refreshToken) {
        this.toastService.error('Invalid or expired reset link.');
        this.router.navigate(['/login'], { replaceUrl: true });
        return;
      }

      this.authFacade.authDomainService.storeAttribute('token', token);
      this.authFacade.authDomainService.storeAttribute('refreshToken', refreshToken);

      this.router.navigate(['/reset-password', token], {
        replaceUrl: true,
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
