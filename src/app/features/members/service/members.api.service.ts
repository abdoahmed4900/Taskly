import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersApiService {
  httpClient = inject(HttpClient);

  getProjectMembers(projectId: string) {
    return this.httpClient.get(`rest/v1/get_project_members?project_id=eq.${projectId}`).pipe(
      tap(val => {
        console.log(`member val : ${JSON.stringify(val)}`);
      }),
    );
  }

  sendProjectInvitation(projectId: string, email: string) {
    return this.httpClient.post(`rest/v1/rpc/invite_member`, {
      p_email: email,
      p_project_id: projectId,
      p_app_url: 'http://localhost:4200',
      p_base_url: 'https://fhpiqckdzomsuabxnufs.supabase.co',
    });
  }
}
