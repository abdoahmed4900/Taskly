import { Injectable, inject } from '@angular/core';
import { TaskApiService } from '../service/task.api.service';
import { Task, TaskStatus } from '../task';

@Injectable({
  providedIn: 'root',
})
export class TaskFacade {
  taskApiService = inject(TaskApiService);
  getEpicTasks(epicId: string) {
    return this.taskApiService.getEpicTasks(epicId);
  }
  addTask(task: Task) {
    return this.taskApiService.addTask(task);
  }

  getTaskDetails(projectId: string, taskId: string) {
    return this.taskApiService.getTaskDetails(projectId, taskId);
  }
  updateTaskStatus(taskId: string, status: TaskStatus) {
    return this.taskApiService.updateTaskStatus(taskId, status);
  }
  updateTask(taskId: string, updatedFields: unknown) {
    return this.taskApiService.updateTask(taskId, updatedFields);
  }
}
