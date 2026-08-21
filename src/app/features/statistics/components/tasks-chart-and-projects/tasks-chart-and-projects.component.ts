import { Component, OnInit, input, signal } from '@angular/core';
import { TaskStatisticsRes } from '../../model/task.statistics.response.model';
import { TaskStatus } from '../../../tasks/task';
import { statusOptions } from '../../../../shared/constants';

@Component({
  selector: 'app-tasks-chart-and-projects',
  standalone: true,
  imports: [],
  templateUrl: './tasks-chart-and-projects.component.html',
})
export class TasksChartAndProjectsComponent implements OnInit {
  stats = input<TaskStatisticsRes>();
  statusOptions = statusOptions;
  daily = signal<
    {
      statuses: Partial<Record<TaskStatus, number>>;
      day: string;
    }[]
  >([]);
  ngOnInit() {
    const arr = [] as { statuses: Partial<Record<TaskStatus, number>>; day: string }[];
    if (this.stats()) {
      this.stats()?.daily.map(v => {
        arr.push(v);
      });
      this.daily.set(arr);
    }
  }

  getChartRowWidth(percent: unknown) {
    console.log(Number(percent));
    console.log(this.stats()?.totalTasks);
    console.log(Number(percent) / this.stats()!.totalTasks);

    return Number(percent) / this.stats()!.totalTasks;
  }
}
