import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TaskStatisticsReq } from '../model/task.statistics.request.model';
import { Observable, map } from 'rxjs';
import { TaskStatisticsRes } from '../model/task.statistics.response.model';
import { TaskStatus } from '../../tasks/task';

@Injectable({
  providedIn: 'root',
})
export class StatisticsApiService {
  httpClient = inject(HttpClient);
  getTasksKpiStats(stat: TaskStatisticsReq): Observable<TaskStatisticsRes> {
    return this.httpClient
      .post(`rest/v1/rpc/get_tasks_calendar_stats`, {
        p_start_date: stat.pStartDate,
        p_end_date: stat.pEndDate,
        p_project_id: stat.pProjectId,
        p_status: stat.pStatus,
      })
      .pipe(
        map(stats => {
          const s = stats as {
            daily: {
              day: string;
              statuses: Partial<Record<TaskStatus, number>>;
            }[];
            totals: Partial<Record<TaskStatus, number>>;
            total_tasks: number;
            done_tasks: number;
            overdue_tasks: number;
          };
          console.log({
            daily: s.daily,
            doneTasks: s.done_tasks,
            overdueTasks: s.overdue_tasks,
            totalTasks: s.total_tasks,
            totals: s.totals,
          });
          return {
            daily: s.daily,
            doneTasks: s.done_tasks,
            overdueTasks: s.overdue_tasks,
            totalTasks: s.total_tasks,
            totals: s.totals,
          };
        }),
      );
  }
}
