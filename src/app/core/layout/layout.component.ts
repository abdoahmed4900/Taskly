import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoggedInComponent } from './logged-in/logged.in.layout.component';
import { Component, computed, inject, signal } from '@angular/core';
import { GuestLayoutComponent } from './guest/guest.layout.component';
import { AuthFacade } from '../../features/auth/facade/auth.facade';
import { ToastComponent } from '../../shared/ui/components/toast/toast.component';
import { TabBarComponent } from '../components/tab-bar/tab-bar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <main class="min-h-screen flex flex-col bg-(--background)">
      <app-navbar
        (isSideBarOpened)="setSideBarToggle($event)"
        [(sidebarOpened)]="isSideBarToggled"
      ></app-navbar>

      @if (isLoggedIn()) {
        <app-logged-in [(isSideBarToggled)]="isSideBarToggled"></app-logged-in>
      } @else {
        <app-guest-layout></app-guest-layout>
      }

      <app-tab-bar></app-tab-bar>
    </main>
    <app-toast-component></app-toast-component>
  `,
  imports: [
    GuestLayoutComponent,
    LoggedInComponent,
    ToastComponent,
    TabBarComponent,
    NavbarComponent,
  ],
})
export class LayoutComponent {
  authFacade = inject(AuthFacade);
  isSideBarToggled = signal(false);

  setSideBarToggle(val: boolean) {
    this.isSideBarToggled.set(val);
  }
  isLoggedIn = computed(() => this.authFacade.authDomainService.isUserLoggedIn());
  constructor() {
    if (this.authFacade.authDomainService.isUserLoggedIn()) {
      this.authFacade.getUser().pipe(takeUntilDestroyed()).subscribe();
    }
  }
}
