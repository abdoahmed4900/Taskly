import { Directive, ElementRef, EventEmitter, HostListener, Output, inject } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  element = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as Node;

    if (!this.element.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
