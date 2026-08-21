import { Component, computed, inject, signal, OnInit, output } from '@angular/core';
import { ToastService } from '../../../../shared/service/toast.service';
import { StatisticsFacade } from '../../statistics.facade';
import { TaskStatisticsRes } from '../../model/task.statistics.response.model';
import { SubmitButtonComponent } from '../../../auth/components/submit-button/submit-button.component';

@Component({
  selector: 'app-calendar-range-text',
  standalone: true,
  imports: [SubmitButtonComponent],
  templateUrl: './calendar-range-text.component.html',
})
export class CalendarRangeTextComponent implements OnInit {
  statisticsFacade = inject(StatisticsFacade);
  statsOutput = output<TaskStatisticsRes>();
  calendarViewFirstDate = computed(() => {
    return this.currentMonthDays().at(0) ?? (new Date() as Date);
  });
  currentMonthDays = signal<Date[]>([]);
  isSelectingRange = signal(false);

  calendarViewEndDate = computed(() => {
    const days = this.currentMonthDays();

    if (days.length > 0) {
      return days.at(-1)!;
    }

    const date = new Date(this.calendarViewFirstDate());
    date.setDate(date.getDate() + 6);

    return date;
  });
  startDate = signal<Date>(new Date());
  endDate = signal<Date>(new Date());
  isCalendarOpen = signal(false);
  currentYear = signal(2026);
  toastService = inject(ToastService);
  monthName = computed(() => {
    const date = new Date();
    date.setMonth(this.calendarViewEndDate().getMonth());
    return date.toLocaleString('en-US', { month: 'long' });
  });

  goBack() {
    const nextDate = new Date(this.calendarViewFirstDate());

    nextDate.setDate(nextDate.getDate() - 21);
    const arr = [new Date(nextDate)];
    this.currentMonthDays.set([]);
    for (let index = 1; index < 21; index++) {
      nextDate.setDate(nextDate.getDate() + 1);
      arr.push(new Date(nextDate));
    }
    this.currentMonthDays.set(arr);
    this.currentYear.set(this.calendarViewEndDate().getFullYear());
  }
  goNext() {
    const firstDate = new Date(this.calendarViewEndDate());
    firstDate.setDate(firstDate.getDate() + 1);

    const days: Date[] = [];

    for (let index = 0; index < 21; index++) {
      const date = new Date(firstDate);
      date.setDate(firstDate.getDate() + index);
      days.push(date);
    }

    this.currentMonthDays.set(days);
    this.currentYear.set(this.calendarViewEndDate().getFullYear());
  }

  toggleCalendar() {
    this.isCalendarOpen.update(val => !val);
  }
  isDateInRange(date: Date): boolean {
    const current = new Date(date);
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());

    current.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return current >= start && current <= end;
  }

  isStartDate(date: Date): boolean {
    return this.isSameDate(date, this.startDate());
  }

  isEndDate(date: Date): boolean {
    return this.isSameDate(date, this.endDate());
  }

  private isSameDate(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  ngOnInit(): void {
    this.endDate()!.setDate(this.startDate()!.getDate() + 6);
    const nextDate = this.calendarViewFirstDate();
    this.currentMonthDays.set([new Date(nextDate)]);
    for (let index = 1; index < 21; index++) {
      nextDate.setDate(nextDate.getDate() + 1);
      this.currentMonthDays.update(v => [...v, new Date(nextDate)]);
    }

    this.getCurrentStats();
  }

  days = ['MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT', 'SUN'];

  private getCurrentStats() {
    this.statisticsFacade
      .getTaskStats({
        pStartDate: `${this.startDate().getFullYear().toString()}-${(this.startDate().getMonth() + 1).toString()}-${this.startDate().getDate().toString()}`,
        pEndDate: `${this.endDate().getFullYear().toString()}-${(this.endDate().getMonth() + 1).toString()}-${this.endDate().getDate().toString()}`,
      })
      .subscribe(val => {
        this.statsOutput.emit(val);
      });
  }

  applyRange() {
    this.getCurrentStats();
  }

  formatDate(date: Date) {
    return `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`;
  }
  formatEndDate(date: Date) {
    return `${this.formatDate(date)} ${date.getFullYear()}`;
  }

  setRangeDate(date: Date) {
    if (!this.isSelectingRange()) {
      this.startDate.set(new Date(date));
      this.endDate.set(new Date(date));
      this.isSelectingRange.set(true);

      return;
    }

    const selectedDate = new Date(date);

    if (selectedDate < this.startDate()) {
      if (this.isEndDateInWeekRange(selectedDate)) {
        this.endDate.set(this.startDate());
        this.startDate.set(selectedDate);
      } else {
        this.startDate.set(selectedDate);
        this.endDate.set(selectedDate);
      }
    } else {
      if (this.isEndDateInWeekRange(selectedDate)) {
        this.endDate.set(selectedDate);
      }
    }

    this.isSelectingRange.set(false);
  }

  isEndDateInWeekRange(date: Date): boolean {
    const current = new Date(date);
    const start = new Date(this.startDate());

    current.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    let diffInTime = current.getTime() - start.getTime();

    if (diffInTime < 0) {
      diffInTime = -diffInTime;
    }

    let diffInDays = Math.round(diffInTime / oneDay);

    if (diffInDays < 0) {
      diffInDays = -diffInDays;
    }

    if (diffInDays < 7) {
      return true;
    }
    this.toastService.error('Range should not be more than a week');

    return false;
  }
}
