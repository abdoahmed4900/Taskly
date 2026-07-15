import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-guest-layout',
  standalone: true,
  template: `
    <section class="flex-1">
      <router-outlet></router-outlet>
    </section>
  `,
  imports: [RouterOutlet],
})
export class GuestLayoutComponent {}
