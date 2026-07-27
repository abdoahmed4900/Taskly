import { Component, computed, input } from '@angular/core';
import { getNameInitials } from '../../../../../shared/utils';

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
    return getNameInitials(this.assigneeName()!);
  });
}
