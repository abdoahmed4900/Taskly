import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-epic-modal-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
})
export class EpicModalComponent {
  opened = input.required<boolean>();

  title = input('');

  closed = output<void>();

  close() {
    this.closed.emit();
  }
}
