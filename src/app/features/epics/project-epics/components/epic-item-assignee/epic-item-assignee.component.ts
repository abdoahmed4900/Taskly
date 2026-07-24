import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-epic-item-assignee',
  standalone: true,
  imports: [],
  templateUrl: './epic-item-assignee.component.html',
})
export class EpicItemAssigneeComponent {
  assigneeName = input<string>();
  deadline = input<string>();
  initials = computed(() => {
    let val = '';
    const words = this.assigneeName()!.split(' ');
    if (words.length > 1) {
      words.map(word => {
        val += word.charAt(0);
      });
    } else {
      val = words[0].substring(0, 2);
    }

    return val;
  });
}
