import { Injectable } from '@angular/core';
import { Assignee, CreatedBy, Epic } from '../epic';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EpicsDomainService {
  mapEpicsResponse(value: HttpResponse<object>) {
    const val = JSON.parse(JSON.stringify(value.body)).map((e: unknown) => {
      const epic = e as {
        id: string;
        project_id: string;
        title: string;
        description: string;
        deadline: string;
        created_at: string;
        created_by: CreatedBy;
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
        assignee: epic.assignee,
      } as Epic;
    }) as Epic[];
    return {
      epics: val,
      totalEpics: Number(value.headers.get('Content-Range')?.split('/')[1]),
      rangeStart: value.headers.get('Content-Range')?.split('/')[0].split('-')[0],
      rangeEnd: value.headers.get('Content-Range')?.split('/')[0].split('-')[1],
    };
  }
}
