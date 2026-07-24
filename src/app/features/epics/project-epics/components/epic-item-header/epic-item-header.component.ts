import { Component, input } from '@angular/core';

@Component({
  selector: 'app-epic-item-header',
  standalone: true,
  imports: [],
  templateUrl: './epic-item-header.component.html',
})
export class EpicItemHeaderComponent {
  epicTitle = input<string>();
}
