import { TaskStatus } from '../features/tasks/task';

export const statusOptions = [
  TaskStatus.INPROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.DONE,
  TaskStatus.INREVIEW,
  TaskStatus.READYFORPRODUCTION,
  TaskStatus.READYFORQA,
  TaskStatus.REOPENED,
  TaskStatus.TODO,
];

export const chartColors = [
  'rgb(34, 197, 94)', // Green
  'rgb(236, 72, 153)', // Pink
  'rgb(234, 179, 8)', // Yellow
  'rgb(249, 115, 22)', // Orange
  'rgb(59, 130, 246)', // Blue
  'rgb(139, 92, 246)', // Purple
  'rgb(20, 184, 166)', // Teal
  'rgb(132, 204, 22)', // Lime
  'rgb(244, 63, 94)', // Rose
];
