import { ProjectFacade } from './../../../projects/facade/project.facade';
import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { TaskStatus } from '../../../tasks/task';
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

  constructor() {
    effect(() => {
      if (this.statsDomainService.taskReq()) {
        this.getProjectsTasks();
      }
    });
  }

  destroy$ = new Subject<void>();
  statusOptions = statusOptions;

  daily = signal<
    {
      statuses: Partial<Record<TaskStatus, number>>;
      day: string;
    }[]
  >([]);
  ngOnInit() {
    const arr = [] as { statuses: Partial<Record<TaskStatus, number>>; day: string }[];
    if (this.statsDomainService.taskRes()) {
      this.statsDomainService.taskRes()?.daily.map(v => {
        arr.push(v);
      });
      this.daily.set(arr);
    }
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
