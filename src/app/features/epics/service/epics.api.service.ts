import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EpicsApiService {
  httpClient = inject(HttpClient);
  getProjectEpics(projectId: string) {
    return this.httpClient.get(`rest/v1/project_epics?project_id=eq.${projectId}`);
  }
}
