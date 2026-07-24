import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  opened = input.required<boolean>();

  title = input('');

  closed = output<void>();

  containerClass = input<string>();
  padding = input<string>();

  close() {
    this.closed.emit();
  }
}
