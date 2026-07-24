import { Injectable, inject } from '@angular/core';
import { EpicsApiService } from '../service/epics.api.service';
import { Epic } from '../epic';
import { map } from 'rxjs';
import { EpicsDomainService } from '../service/epics.domain.service';

@Injectable({
  providedIn: 'root',
})
export class EpicsFacade {
  epicsApiService = inject(EpicsApiService);
  epicsDomainService = inject(EpicsDomainService);
  getProjectEpics(projectId: string) {
    return this.epicsApiService.getProjectEpics(projectId);
  }
  getProjectEpicsWithRange(projectId: string, limit: number, offset: number) {
    return this.epicsApiService.getProjectEpicsWithRange(projectId, limit, offset).pipe(
      map(val => {
        return this.epicsDomainService.mapEpicsResponse(val);
      }),
    );
  }

  addEpic(epic: Epic) {
    return this.epicsApiService.addProjectEpic(epic);
  }

  updateEpic(epic: Epic) {
    return this.epicsApiService.updateEpic(epic);
  }
}
