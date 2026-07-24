import { Component, input } from '@angular/core';

@Component({
  selector: 'app-epic-item-createby',
  standalone: true,
  imports: [],
  templateUrl: './epic-item-createby.component.html',
})
export class EpicItemCreatebyComponent {
  createdAt = input<string>();
  createdByName = input<string>();
}
