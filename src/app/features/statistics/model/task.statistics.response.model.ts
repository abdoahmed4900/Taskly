import { TaskStatus } from '../../tasks/task';

export interface TaskStatisticsRes {
  daily: {
    statuses: Partial<Record<TaskStatus, number>>;
    day: string;
  }[];
  totals: Partial<Record<TaskStatus, number>>;
  totalTasks: number;
  doneTasks: number;
  overdueTasks: number;
}
