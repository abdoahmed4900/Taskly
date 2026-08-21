import { TaskStatus } from '../features/tasks/task';

export const statusOptions = [
  TaskStatus.TODO,
  TaskStatus.INPROGRESS,
  TaskStatus.DONE,
  TaskStatus.BLOCKED,
  TaskStatus.INREVIEW,
  TaskStatus.READYFORQA,
  TaskStatus.REOPENED,
  TaskStatus.READYFORPRODUCTION,
];
