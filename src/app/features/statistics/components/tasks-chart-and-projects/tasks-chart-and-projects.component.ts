import { ProjectFacade } from './../../../projects/facade/project.facade';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { chartColors, statusOptions } from '../../../../shared/constants';
import { Project } from '../../../projects/model/project';
import { Subject, takeUntil } from 'rxjs';
import { TaskFacade } from '../../../tasks/facade/task.facade';
import { StatisticsDomainService } from '../../service/statistics.domain.service';
import { StatsChartComponent } from './stats-chart/stats-chart.component';

@Component({
  selector: 'app-tasks-chart-and-projects',
  standalone: true,
  imports: [StatsChartComponent],
  templateUrl: './tasks-chart-and-projects.component.html',
})
export class TasksChartAndProjectsComponent implements OnInit, OnDestroy {
  statsDomainService = inject(StatisticsDomainService);

  projectFacade = inject(ProjectFacade);
  taskFacade = inject(TaskFacade);
  projects = signal<Project[]>([]);
  areProjectsLoaded = signal(false);
  rangeTasks = computed(() => {
    return this.statsDomainService.taskRes()?.totalTasks;
  });
  projectTasksnumber = signal<
    {
      projectId: string;
      projectName: string;
      taskCount: number;
    }[]
  >([]);
  isLoading = computed(() => {
    return this.statsDomainService.isLoading();
  });
  colors = chartColors;

  destroy$ = new Subject<void>();
  statusOptions = statusOptions;

  daily = computed(() => {
    return this.statsDomainService.taskRes()?.daily;
  });
  ngOnInit() {
    this.getProjectsTasks();
  }

  getChartRowWidth(percent: unknown) {
    if (this.statsDomainService.taskRes()!.totalTasks == 0) {
      return 0;
    }
    return Number(percent) / this.statsDomainService.taskRes()!.totalTasks;
  }

  getProjectsTasks() {
    this.projectFacade
      .getProjectTasksLength({ ...this.statsDomainService.taskReq()! })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.projectTasksnumber.set(value);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
