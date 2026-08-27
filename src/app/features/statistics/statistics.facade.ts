import { Injectable, inject } from '@angular/core';
import { StatisticsApiService } from './service/statistics.api.service';
import { TaskStatisticsReq } from './model/task.statistics.request.model';
import { tap } from 'rxjs';
import { StatisticsDomainService } from './service/statistics.domain.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsFacade {
  statisticsApiService = inject(StatisticsApiService);
  statisticsDomainService = inject(StatisticsDomainService);
  getTaskStats(stat: TaskStatisticsReq) {
    this.statisticsDomainService.setStatsReq(stat);
    return this.statisticsApiService.getTasksKpiStats(stat).pipe(
      tap(res => {
        this.statisticsDomainService.setStatsRes(res);
      }),
    );
  }
}
