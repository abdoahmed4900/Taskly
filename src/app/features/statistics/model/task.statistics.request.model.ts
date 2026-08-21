import { TaskStatus } from '../../tasks/task';

export interface TaskStatisticsReq {
  pStartDate: string;
  pEndDate: string;
  pProjectId?: string | null;
  pStatus?: TaskStatus | null;
}
