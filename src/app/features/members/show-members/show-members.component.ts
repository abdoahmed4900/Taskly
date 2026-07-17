import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MembersFacade } from '../facade/members.facade';
import { Subject, takeUntil } from 'rxjs';
import { Member } from '../member';
import { ToastService } from '../../../shared/service/toast.service';
import { MembersListMobile } from './components/members-list-mobile/members.list.mobile.component';
import { MembersTable } from './components/members-table/members.table.component';

@Component({
  selector: 'app-show-members',
  standalone: true,
  imports: [RouterLink, MembersListMobile, MembersTable],
  templateUrl: './show-members.component.html',
})
export class ShowMembersComponent implements OnInit {
  isLoaded = signal(false);
  name = signal('');
  destroy$ = new Subject<void>();
  membersFacade = inject(MembersFacade);
  route = inject(ActivatedRoute);
  id = '';
  members = signal<Member[]>([]);
  toastService = inject(ToastService);

  constructor() {
    effect(() => {
      console.log(`members : ${JSON.stringify(this.members())}`);
    });
  }
  getNameInitials(val: string) {
    let initials = '';
    const words = val.split(' ');
    console.log(words);

    if (words.length > 1) {
      words.map(word => {
        initials += word.charAt(0);
        console.log(`val + ${val}`);
      });
    } else {
      initials = words[0].substring(0, 2);
    }
    console.log(val);

    return initials;
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.url.at(1)!.toString();
    this.isLoaded.set(false);
    this.membersFacade
      .getProjectMembers(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.isLoaded.set(true);
          this.members.set(value);
        },
        error: () => {
          this.isLoaded.set(true);
          this.members.set([]);
          this.toastService.error('Error Getting project members');
        },
      });
    this.isLoaded.set(true);
  }
}
