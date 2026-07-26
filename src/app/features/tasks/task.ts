import { Assignee, CreatedBy } from '../epics/epic';

export interface Task {
  projectId?: string;
  createdAt?: string;
  taskId?: string;
  id?: string;
  epicId?: string;
  title?: string;
  epic?: {
    title?: string;
    id?: string;
    epicId?: string;
  };
  createdBy?: CreatedBy;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  status?: TaskStatus | '';
  assignee?: Assignee;
}

export enum TaskStatus {
  TODO = 'TO_DO',
  INPROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  INREVIEW = 'IN_REVIEW',
  READYFORQA = 'READY_FOR_QA',
  REOPENED = 'REOPENED',
  READYFORPRODUCTION = 'READY_FOR_PRODUCTION',
  DONE = 'DONE',
}
