import { AuthDomainService } from './../../../../features/auth/service/auth.service.domain';
import { Component, computed, inject } from '@angular/core';

@Component({
  selector: 'app-website-icon',
  standalone: true,
  imports: [],
  templateUrl: './website-icon.component.html',
  styleUrl: './website-icon.component.css',
})
export class WebsiteIconComponent {
  authDomainService = inject(AuthDomainService);
  isLoggedIn = computed(() => {
    return this.authDomainService.isLoggedIn();
  });
}
