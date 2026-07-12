import { Component, OnDestroy, computed, inject, model, output, signal } from '@angular/core';
import { AuthDomainService } from '../../../features/auth/service/auth.service.domain';
import { WebsiteIconComponent } from '../../../shared/ui/components/website-icon/website-icon.component';
import { AuthFacade } from '../../../features/auth/facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/service/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [WebsiteIconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  authDomainService = inject(AuthDomainService);
  isSideBarOpened = output<boolean>();
  authFacade = inject(AuthFacade);
  toastService = inject(ToastService);

  isLoggedIn = computed(() => this.authDomainService.isUserLoggedIn());
  name = computed(() => {
    return this.authDomainService.name();
  });
  job = computed(() => {
    return this.authDomainService.job();
  });
  router = inject(Router);
  sidebarOpened = model(false);
  dropDownOpened = signal(false);
  destroy$ = new Subject<void>();

  toggleSidebar() {
    this.sidebarOpened.update(val => !val);
    this.isSideBarOpened.emit(this.sidebarOpened());
  }
  toggleDropDown() {
    this.dropDownOpened.update(val => !val);
  }
  initials = computed(() => {
    let val = '';
    const words = this.name()!.split(' ');
    if (words.length > 1) {
      words.map(word => {
        val += word.charAt(0);
      });
    } else {
      val = words[0].substring(0, 2);
    }

    return val;
  });

  logout() {
    this.dropDownOpened.set(false);
    return this.authFacade
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Logged out successfully');
          this.router.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
