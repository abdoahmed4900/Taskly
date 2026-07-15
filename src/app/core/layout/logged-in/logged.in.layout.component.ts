import { Component, model } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-logged-in',
  standalone: true,
  template: `
    <div class="flex flex-1">
      <!-- Desktop Sidebar -->
      <aside [class.hidden]="!isSideBarToggled()" class="z-3 lg:block">
        <app-sidebar
          [(isSidebarToggled)]="isSideBarToggled"
          (isOpen)="setSideBarToggle($event)"
        ></app-sidebar>
      </aside>

      <!-- Page -->
      <section
        class="flex-1 relative lg:px-8 px-6"
        [class.lg:ms-18]="!isSideBarToggled()"
        [class.lg:ms-65]="isSideBarToggled()"
      >
        <router-outlet></router-outlet>
      </section>
    </div>
  `,
  imports: [RouterOutlet, SidebarComponent],
})
export class LoggedInComponent {
  isSideBarToggled = model(false);
  setSideBarToggle(val: boolean) {
    this.isSideBarToggled.set(val);
  }
}
