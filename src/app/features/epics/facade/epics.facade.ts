import { Injectable, inject } from '@angular/core';
import { EpicsApiService } from '../service/epics.api.service';
import { Epic } from '../epic';

@Injectable({
  providedIn: 'root',
})
export class EpicsFacade {
  epicsApiService = inject(EpicsApiService);
  getProjectEpics(projectId: string) {
    return this.epicsApiService.getProjectEpics(projectId);
  }
  getProjectEpicsWithRange(projectId: string, limit: number, offset: number) {
    return this.epicsApiService.getProjectEpicsWithRange(projectId, limit, offset);
  }

  addEpic(epic: Epic) {
    return this.epicsApiService.addProjectEpic(epic);
  }
}
