import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MembersApiService {
  httpClient = inject(HttpClient);

  getProjectMembers(projectId: string) {
    return this.httpClient.get(`rest/v1/get_project_members?project_id=eq.${projectId}`);
  }
}
