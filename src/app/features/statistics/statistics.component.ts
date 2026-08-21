import { statusOptions } from './../../shared/constants';
import { TaskStatisticsRes } from './model/task.statistics.response.model';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CalendarRangeTextComponent } from './components/calendar-range-text/calendar-range-text.component';
import { CalendarStatsComponent } from './components/calendar-stats/calendar-stats.component';
import { TasksChartAndProjectsComponent } from './components/tasks-chart-and-projects/tasks-chart-and-projects.component';
import { StatisticsFacade } from './statistics.facade';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CalendarStatsComponent,
    CalendarRangeTextComponent,
    CalendarStatsComponent,
    TasksChartAndProjectsComponent,
  ],
  styles: [],
  templateUrl: './statistics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  stats = signal<TaskStatisticsRes | null>(null);
  statusOptions = statusOptions;
  statisticsFacade = inject(StatisticsFacade);

  formatStatDay(day: string) {
    const date = new Date(day);
    return `${date.getDate().toString()} ${date.toLocaleString('en-US', { month: 'short' })}`;
  }

  setStats(stats: TaskStatisticsRes) {
    this.stats.set(stats);
  }

  constructor() {
    effect(() => {
      console.log(this.stats());
    });
  }
}
