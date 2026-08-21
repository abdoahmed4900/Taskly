import { Component, input } from '@angular/core';
import { TaskStatisticsRes } from '../../model/task.statistics.response.model';

@Component({
  selector: 'app-tasks-chart-and-projects',
  standalone: true,
  imports: [],
  templateUrl: './tasks-chart-and-projects.component.html',
})
export class TasksChartAndProjectsComponent {
  stats = input<TaskStatisticsRes>();
}
