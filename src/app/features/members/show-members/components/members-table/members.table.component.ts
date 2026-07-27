import { Component, model } from '@angular/core';
import { Member } from '../../../member';
import { getNameInitials } from '../../../../../shared/utils';

@Component({
  selector: 'app-members-table-component',
  standalone: true,
  templateUrl: './members.table.component.html',
})
export class MembersTable {
  members = model<Member[]>([]);
  getNameInitials(val: string) {
    return getNameInitials(val);
  }
}
