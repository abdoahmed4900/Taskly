import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Task } from '../../../../tasks/task';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../../../epics/components/modal/modal.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [RouterLink, ModalComponent],
  templateUrl: './tasks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListComponent {
  tasks = input<Task[]>([]);
  projectId = input<string>('');
  isModalOpened = signal(false);
  selectedItem = signal<Task>({});
  setModalStatus(item: Task) {
    this.isModalOpened.update(v => !v);
    this.selectedItem.set(item);
  }
  close() {
    this.isModalOpened.set(false);
  }
  getNameInitials(val: string) {
    let initials = '';
    const words = val.split(' ');

    if (words.length > 1) {
      words.map(word => {
        initials += word.charAt(0);
      });
    } else {
      initials = words[0].substring(0, 2);
    }
    return initials;
  }
}
