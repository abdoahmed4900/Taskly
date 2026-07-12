import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../shared/service/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthFacade } from '../facade/auth.facade';

@Component({
  standalone: true,
  template: '',
})
export class RecoveryComponent implements OnInit {
  private router = inject(Router);
  toastService = inject(ToastService);
  activatedRoute = inject(ActivatedRoute);
  destroy$ = new Subject<void>();
  authFacade = inject(AuthFacade);
  token = '';
  refreshToken = '';

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

  ngOnInit() {
    this.checkLinkValidity();
  }
}
