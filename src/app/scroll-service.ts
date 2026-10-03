// scroll-lock.service.ts
import { Injectable, RendererFactory2, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private renderer = inject(RendererFactory2).createRenderer(null, null);
  private scrollY = 0;
  private lockCount = 0;

  lock() {
    this.lockCount++;
    if (this.lockCount > 1) return;

    this.scrollY = window.scrollY || document.documentElement.scrollTop;

    // نطبق على body
    this.renderer.setStyle(document.body, 'position', 'fixed');
    this.renderer.setStyle(document.body, 'top', `-${this.scrollY}px`);
    this.renderer.setStyle(document.body, 'left', '0');
    this.renderer.setStyle(document.body, 'right', '0');
    this.renderer.setStyle(document.body, 'width', '100%');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  unlock() {
    this.lockCount--;
    if (this.lockCount > 0) return;

    this.renderer.removeStyle(document.body, 'position');
    this.renderer.removeStyle(document.body, 'top');
    this.renderer.removeStyle(document.body, 'left');
    this.renderer.removeStyle(document.body, 'right');
    this.renderer.removeStyle(document.body, 'width');
    this.renderer.removeStyle(document.body, 'overflow');

    window.scrollTo(0, this.scrollY);
  }
}
