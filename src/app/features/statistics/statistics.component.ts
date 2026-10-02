import { statusOptions } from './../../shared/constants';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
  statusOptions = statusOptions;
  statisticsFacade = inject(StatisticsFacade);
  statsRes = computed(() => {
    return this.statisticsFacade.statisticsDomainService.taskRes();
  });
  statsReq = computed(() => {
    return this.statisticsFacade.statisticsDomainService.taskReq();
  });
  today = new Date().toISOString().split('T')[0];

  formatStatDay(day: string) {
    const date = new Date(day);
    return `${date.getDate().toString()} ${date.toLocaleString('en-US', { month: 'short' })}`;
  }
}
