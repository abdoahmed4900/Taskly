import { Component, HostListener, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-icon-component',
  standalone: true,

  template: `
    <svg
      class="block"
      viewBox="0 0 24 24"
      fill="currentColor"
      [attr.width]="size()"
      [attr.height]="size()"
    >
      <use [attr.href]="iconHref()"></use>
    </svg>
  `,
})
export class IconComponent {
  name = input.required<string>();
  size = input(24);
  isDesktop = signal(window.innerWidth > 1024);

  @HostListener('window:resize', [])
  changeDesktop() {
    this.isDesktop.set(window.innerWidth > 1024);
  }

  iconHref = computed(() => {
    if (this.name() === 'projects') {
      return this.isDesktop()
        ? 'assets/sprite.svg#icon-projects-desktop'
        : 'assets/sprite.svg#icon-projects-mobile';
    }
    if (this.name() === 'logo') {
      return this.isDesktop()
        ? 'assets/sprite.svg#icon-logo-desktop'
        : 'assets/sprite.svg#icon-logo-mobile';
    }
    return `assets/sprite.svg#icon-${this.name()}`;
  });
}
