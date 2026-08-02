import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade } from '../../auth/facade/auth.facade';
import { MembersFacade } from '../facade/members.facade';
import { WebsiteIconComponent } from '../../../shared/ui/components/website-icon/website-icon.component';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../../shared/service/toast.service';
import { SubmitButtonComponent } from '../../auth/components/submit-button/submit-button.component';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [WebsiteIconComponent, SubmitButtonComponent],
  templateUrl: './invite.component.html',
})
export class InviteComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  authFacade = inject(AuthFacade);
  membersFacade = inject(MembersFacade);
  router = inject(Router);
  destroy$ = new Subject<void>();
  isLoading = signal(false);
  toastService = inject(ToastService);

  ngOnInit() {
    if (!this.authFacade.authDomainService.isUserLoggedIn()) {
      this.router.navigateByUrl('/login');
    }
  }
  acceptInvitation() {
    if (this.authFacade.authDomainService.isUserLoggedIn()) {
      const token = this.route.snapshot.queryParamMap.get('token');
      if (token) {
        this.isLoading.set(true);
        this.membersFacade
          .acceptProjectInvitation(token)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.isLoading.set(false);
              this.toastService.success('Invitation accepted successfully!');
              this.router.navigate(['/projects']);
            },
            error: () => {
              this.isLoading.set(false);
              this.toastService.error('Failed to accept invitation. Please try again.');
              this.router.navigate(['/projects']);
            },
          });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
