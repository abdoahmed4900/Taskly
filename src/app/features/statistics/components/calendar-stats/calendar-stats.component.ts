import { Component, computed, inject } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/components/icon-component/icon-component';
import { StatisticsDomainService } from '../../service/statistics.domain.service';

@Component({
  selector: 'app-calendar-stats',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './calendar-stats.component.html',
})
export class CalendarStatsComponent {
  statsDomainService = inject(StatisticsDomainService);
  isLoading = computed(() => {
    return this.statsDomainService.isLoading();
  });
}
