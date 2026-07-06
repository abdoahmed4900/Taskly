import { AuthFacade } from './features/auth/facade/auth.facade';
import { AuthDomainService } from './features/auth/service/auth.service.domain';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { TabBarComponent } from './core/components/tab-bar/tab-bar.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent, TabBarComponent, SidebarComponent],
})
export class AppComponent implements OnInit {
  authDomainService = inject(AuthDomainService);
  authFacade = inject(AuthFacade);
  isSideBarToggled = signal(true);
  setSideBarToggle(val: boolean) {
    console.log('set toggle');

    this.isSideBarToggled.set(val);
    console.log(this.isSideBarToggled());
  }
  isLoggedIn = computed(() => this.authDomainService.isUserLoggedIn());
  ngOnInit(): void {
    if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
      this.authFacade.getUser().subscribe();
    }
  }
}
