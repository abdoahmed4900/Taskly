import { Component, HostListener, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-icon-component',
  standalone: true,
  template: `
    <svg [attr.width]="size() !== 0 ? size() : 20" [attr.height]="size() !== 0 ? size() : 20">
      <use [attr.href]="iconHref()"></use>
    </svg>
  `,
})
export class IconComponent {
  name = input.required<string>();
  size = input(0);
  isDesktop = signal(window.innerWidth > 1024);
  @HostListener('window:resize', [])
  changeDesktop() {
    this.isDesktop.set(window.innerWidth > 1024);
  }

  iconHref = computed(() => {
    if (this.name() == 'projects') {
      return this.isDesktop()
        ? `assets/sprite.svg#icon-projects-desktop`
        : `assets/sprite.svg#icon-projects-mobile`;
    }
    if (this.name() == 'logo') {
      return this.isDesktop()
        ? `assets/sprite.svg#icon-logo-desktop`
        : `assets/sprite.svg#icon-logo-mobile`;
    }
    return `assets/sprite.svg#icon-${this.name()}`;
  });
}
