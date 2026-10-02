import { StatisticsDomainService } from './../../../service/statistics.domain.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js/auto';
import { chartColors, statusOptions } from '../../../../../shared/constants';
Chart.register(...registerables);

@Component({
  selector: 'app-stats-chart',
  standalone: true,
  imports: [],
  host: {
    '(window:resize)': 'changeCutout()',
  },
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

  changeCutout() {
    this.cutout.set(window.innerWidth > 1024 ? '60%' : '80%');
  }
  cutout = signal(window.innerWidth > 1024 ? '60%' : '80%');
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
        responsive: true,
        maintainAspectRatio: false,

        cutout: this.cutout(),

        layout: {
          padding: 0,
        },

        elements: {
          arc: {
            borderWidth: 0,
            hoverOffset: 0,
          },
        },

        plugins: {
          legend: {
            display: false,
          },

          title: {
            display: false,
          },
        },

        hover: {
          mode: undefined,
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
