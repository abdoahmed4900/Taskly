import { Component, input } from '@angular/core';
import { TaskStatisticsRes } from '../../model/task.statistics.response.model';
import { IconComponent } from '../../../../shared/ui/components/icon-component/icon-component.component';

@Component({
  selector: 'app-calendar-stats',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './calendar-stats.component.html',
})
export class CalendarStatsComponent {
  stats = input<TaskStatisticsRes>();
}
