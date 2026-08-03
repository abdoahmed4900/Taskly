import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-tasks',
  standalone: true,
  imports: [],
  templateUrl: './empty-tasks.component.html',
})
export class EmptyTasksComponent {
  isSearching = input<boolean>(false);
}
