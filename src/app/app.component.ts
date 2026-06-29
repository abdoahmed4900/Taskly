import { AuthFacade } from './features/auth/facade/auth.facade';
import { AuthDomainService } from './features/auth/service/auth.service.domain';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { TabBarComponent } from './core/components/tab-bar/tab-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavbarComponent, TabBarComponent],
})
export class AppComponent implements OnInit {
  authDomainService = inject(AuthDomainService);
  authFacade = inject(AuthFacade);
  ngOnInit(): void {
    if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
      this.authFacade.getUser().subscribe();
    }
  }
}
