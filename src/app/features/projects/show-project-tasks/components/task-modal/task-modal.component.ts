import { Component, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../../../../core/components/click-outside.directive';
import { Task } from '../../../../tasks/task';
import { getNameInitials } from '../../../../../shared/utils';

@Component({
  selector: 'app-task-details-modal',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './task-modal.component.html',
})
export class TaskDetailsModalComponent {
  isModalOpened = output<boolean>();
  selectedItem = input<Task>();
  close() {
    this.isModalOpened.emit(false);
  }

  getNameInitials(val: string) {
    return getNameInitials(val);
  }

  formatDate(val: string) {
    const formatted = new Date(val).toLocaleDateString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formatted;
  }
}
