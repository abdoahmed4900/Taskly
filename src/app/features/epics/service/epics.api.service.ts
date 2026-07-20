import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Assignee, CreatedBy, Epic } from '../epic';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EpicsApiService {
  httpClient = inject(HttpClient);
  getProjectEpics(projectId: string) {
    return this.httpClient.get(`rest/v1/project_epics?project_id=eq.${projectId}`).pipe(
      map(value => {
        value = JSON.parse(JSON.stringify(value)).map((e: unknown) => {
          const epic = e as {
            id: string;
            project_id: string;
            title: string;
            description: string;
            deadline: string;
            created_at: string;
            created_by: CreatedBy;
            epic_id: string;
            assignee: Assignee;
          };
          return {
            id: epic.id,
            projectId: epic.project_id,
            title: epic.title,
            description: epic.description,
            deadline: epic.deadline,
            createdAt: epic.created_at.split('T')[0],
            createdBy: epic.created_by,
            epicId: epic.epic_id,
            assignee: epic.assignee,
          } as Epic;
        }) as Epic[];
        return value;
      }),
    ) as Observable<Epic[]>;
  }
  addProjectEpic(epic: Epic) {
    return this.httpClient.post('rest/v1/epics', {
      title: epic.title,
      description: epic.description,
      assignee_id: epic.assigneeId,
      project_id: epic.projectId,
      deadline: epic.deadline,
    });
  }
}
