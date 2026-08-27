import { StatisticsDomainService } from './../../../service/statistics.domain.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js/auto';
import { chartColors, statusOptions } from '../../../../../shared/constants';
Chart.register(...registerables);

@Component({
  selector: 'app-stats-chart',
  standalone: true,
  imports: [],
  templateUrl: './stats-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsChartComponent implements OnDestroy {
  chart!: Chart;
  chartLabels!: Chart;
  statsDomainService = inject(StatisticsDomainService);
  chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  isLoading = computed(() => {
    return this.statsDomainService.isLoading();
  });
  cutout = computed(() => {
    return window.innerWidth > 1024 ? '70%' : '80%';
  });
  statusOptions = statusOptions;
  stats = computed(() => {
    return statusOptions.map(option => {
      return (this.statsDomainService.taskRes()!.totals[option] as number) ?? 0;
    });
  });
  colors = computed(() => {
    return chartColors.slice(0, this.stats().length);
  });
  constructor() {
    effect(() => {
      if (this.isLoading() == false) {
        if (this.chart) {
          this.chart.destroy();
        }
        this.createChart();
      }
    });
  }
  private createChart(): void {
    this.chart = new Chart(this.chartCanvas()!.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            label: 'Tasks',
            data: this.stats(),
            backgroundColor: this.colors(),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        radius: '100%',
        cutout: this.cutout(),
        maintainAspectRatio: false,
        responsive: true,
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
