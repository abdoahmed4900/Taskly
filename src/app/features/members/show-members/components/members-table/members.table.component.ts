import { Component, model } from '@angular/core';
import { Member } from '../../../member';

@Component({
  selector: 'app-members-table-component',
  standalone: true,
  templateUrl: './members.table.component.html',
})
export class MembersTable {
  members = model<Member[]>([]);
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
    console.log(val);

    return initials;
  }
}
