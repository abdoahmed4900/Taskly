import { Component, input, output } from '@angular/core';
import { Task } from '../../../../../tasks/task';
import { getNameInitials } from '../../../../../../shared/utils';

@Component({
  selector: 'app-task-modal-mobile',
  standalone: true,
  imports: [],
  templateUrl: './task-modal-mobile.component.html',
})
export class TaskModalMobileComponent {
  getNameInitials(val: string) {
    return getNameInitials(val);
  }
  selectedItem = input<Task>();
  isModalOpened = output<boolean>();
  startY = 0;

  close() {
    this.isModalOpened.emit(false);
  }

  onTouchStart(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent) {
    const currentY = event.touches[0].clientY;

    if (currentY - this.startY > 120) {
      this.close();
    }
  }

  onTouchEnd() {
    this.startY = 0;
  }
}
