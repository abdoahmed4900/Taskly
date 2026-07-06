import { Component, model } from '@angular/core';

@Component({
  selector: 'app-epics-icon',
  standalone: true,
  imports: [],
  templateUrl: './epics-icon.component.html',
  styleUrl: './epics-icon.component.css',
})
export class EpicsIconComponent {
  isActive = model<boolean>();
}
