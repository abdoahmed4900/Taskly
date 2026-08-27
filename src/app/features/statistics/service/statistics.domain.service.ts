import { Injectable, signal } from '@angular/core';
import { TaskStatisticsReq } from '../model/task.statistics.request.model';
import { TaskStatisticsRes } from '../model/task.statistics.response.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsDomainService {
  taskReq = signal<TaskStatisticsReq | undefined>(undefined);
  taskRes = signal<TaskStatisticsRes | undefined>(undefined);
  isLoading = signal(false);

  setStatsReq(req: TaskStatisticsReq) {
    this.taskReq.set(req);
    this.isLoading.set(true);
  }
  setStatsRes(res: TaskStatisticsRes) {
    this.taskRes.set(res);
    this.isLoading.set(false);
  }
}
