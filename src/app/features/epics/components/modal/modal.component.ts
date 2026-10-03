import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { ScrollLockService } from '../../../../scroll-service';

@Component({
  selector: 'app-modal-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  opened = input.required<boolean>();
  scrollLockService = inject(ScrollLockService);

  ngOnInit() {
    if (this.opened()) {
      this.scrollLockService.lock();
    }
  }

  title = input('');

  closed = output<void>();

  containerClass = input<string>();
  headerClass = input<string>();
  padding = input<string>();

  close() {
    this.scrollLockService.unlock();
    this.closed.emit();
  }
}
