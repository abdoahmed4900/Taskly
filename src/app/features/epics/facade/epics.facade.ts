import { Injectable, inject } from '@angular/core';
import { EpicsApiService } from '../service/epics.api.service';

@Injectable({
  providedIn: 'root',
})
export class EpicsFacade {
  epicsApiService = inject(EpicsApiService);
  getProjectEpics(projectId: string) {
    return this.epicsApiService.getProjectEpics(projectId);
  }
}
