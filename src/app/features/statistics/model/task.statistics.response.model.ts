import { TaskStatus } from '../../tasks/task';

export interface TaskStatisticsRes {
  daily: {
    statuses: Partial<Record<TaskStatus, number>>;
    day: string;
  }[];
  totals: number[];
  totalTasks: number;
  doneTasks: number;
  overdueTasks: number;
}
