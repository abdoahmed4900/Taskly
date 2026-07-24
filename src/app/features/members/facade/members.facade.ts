import { Injectable, inject } from '@angular/core';
import { MembersApiService } from '../service/members.api.service';
import { map } from 'rxjs';
import { Member } from '../member';

@Injectable({
  providedIn: 'root',
})
export class MembersFacade {
  membersApiService = inject(MembersApiService);
  getProjectMembers(projectId: string) {
    return this.membersApiService.getProjectMembers(projectId).pipe(
      map(members => {
        return JSON.parse(JSON.stringify(members)).map((i: unknown) => {
          const x = i as {
            role: string;
            email: string;
            member_id: string;
            project_id: string;
            user_id: string;
            metadata: {
              name: string;
            };
          };
          return {
            role: x.role,
            userId: x.user_id,
            email: x.email,
            memberId: x.member_id,
            projectId: x.project_id,
            name: x.metadata.name,
          } as Member;
        }) as Member[];
      }),
    );
  }
  getProjectMember(projectId: string, assigneeId: string) {
    return this.getProjectMembers(projectId).pipe(
      map(m => {
        const members = m;
        return members
          .filter(member => {
            return member.memberId == assigneeId;
          })
          .at(0);
      }),
    );
  }
}
