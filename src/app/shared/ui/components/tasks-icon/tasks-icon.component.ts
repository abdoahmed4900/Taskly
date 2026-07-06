import { Component, model } from '@angular/core';

@Component({
  selector: 'app-tasks-icon',
  standalone: true,
  imports: [],
  templateUrl: './tasks-icon.component.html',
  styleUrl: './tasks-icon.component.css',
})
export class TasksIconComponent {
  isActive = model<boolean>();
}
