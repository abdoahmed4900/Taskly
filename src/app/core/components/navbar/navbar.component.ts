import { Component, OnDestroy, computed, inject, output, signal } from '@angular/core';
import { AuthDomainService } from '../../../features/auth/service/auth.service.domain';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { WebsiteIconComponent } from '../../../shared/ui/components/website-icon/website-icon.component';
import { AuthFacade } from '../../../features/auth/facade/auth.facade';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SidebarComponent, WebsiteIconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  authDomainService = inject(AuthDomainService);
  isSideBarOpened = output<boolean>();
  authFacade = inject(AuthFacade);
  isLoggedIn = computed(() => this.authDomainService.isUserLoggedIn());
  name = computed(() => {
    return this.authDomainService.name();
  });
  job = computed(() => {
    return this.authDomainService.job();
  });
  router = inject(Router);
  sidebarOpened = signal(false);
  dropDownOpened = signal(false);
  destroy$ = new Subject<void>();

  openSidebar() {
    this.sidebarOpened.set(true);
  }
  closeSidebar() {
    console.log('closed');
    this.sidebarOpened.set(false);
  }
  toggleSidebar() {
    this.sidebarOpened.update(val => !val);
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
          this.router.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
