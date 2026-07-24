import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { Assignee, CreatedBy } from '../../epics/epic';
import { Task, TaskStatus } from '../task';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  httpClient = inject(HttpClient);

  getEpicTasks(epicId: string) {
    return this.httpClient.get(`rest/v1/project_tasks?epic_id=eq.${epicId}`).pipe(
      map(t => {
        const tasks = t as {
          id: string;
          project_id: string;
          epic_id: string;
          title: string;
          description: string;
          status: string;
          created_at: string;
          due_date: string;
          task_id: string;
          epic: { id: string; title: string; epic_id: string };
          created_by: CreatedBy;
          assignee: Assignee;
        }[];
        const newTasks = tasks.map(task => {
          return {
            id: task.id,
            title: task.title,
            description: task.description,
            projectId: task.project_id,
            epicId: task.id,
            status: task.status as TaskStatus,
            createdAt: task.created_at,
            dueDate: task.due_date.split('T')[0],
            taskId: task.task_id,
            assignee: task.assignee,
          } as Task;
        });
        return newTasks;
      }),
    );
  }

  addTask(task: Task) {
    return this.httpClient.post('rest/v1/tasks', {
      project_id: task.projectId,
      epic_id: task.epicId,
      title: task.title,
      description: task.description,
      assignee_id: task.assigneeId,
      due_date: task.dueDate,
      status: task.status,
    });
  }
}
