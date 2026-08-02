import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersFacade } from '../facade/members.facade';
import { Subject, takeUntil } from 'rxjs';
import { Member } from '../member';
import { ToastService } from '../../../shared/service/toast.service';
import { MembersListMobile } from './components/members-list-mobile/members.list.mobile.component';
import { MembersTable } from './components/members-table/members.table.component';
import { Project } from '../../projects/model/project';
import { getNameInitials } from '../../../shared/utils';
import { InviteMemberModalComponent } from './components/invite-member-modal-component/invite-member-modal-component.component';

@Component({
  selector: 'app-show-members',
  standalone: true,
  imports: [MembersListMobile, MembersTable, InviteMemberModalComponent],
  templateUrl: './show-members.component.html',
})
export class ShowMembersComponent implements OnInit {
  updateInviteModalState() {
    this.isInviteModalOpen.update(v => !v);
  }

  setInviteModalState(state: boolean) {
    this.isInviteModalOpen.set(state);
  }
  close() {
    this.isInviteModalOpen.set(false);
  }
  isLoaded = signal(false);
  destroy$ = new Subject<void>();
  membersFacade = inject(MembersFacade);
  route = inject(ActivatedRoute);
  id = '';
  project = signal<Project>({});
  members = signal<Member[]>([]);
  toastService = inject(ToastService);
  isInviteModalOpen = signal(false);

  getNameInitials(val: string) {
    return getNameInitials(val);
  }
  ngOnInit(): void {
    this.project.set(JSON.parse(sessionStorage.getItem('project')!));
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
