import { Injectable, inject } from '@angular/core';
import { StatisticsApiService } from './service/statistics.api.service';
import { TaskStatisticsReq } from './model/task.statistics.request.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsFacade {
  statisticsApiService = inject(StatisticsApiService);
  getTaskStats(stat: TaskStatisticsReq) {
    return this.statisticsApiService.getTasksKpiStats(stat);
  }
}
