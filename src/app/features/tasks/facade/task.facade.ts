import { Injectable, inject } from '@angular/core';
import { TaskApiService } from '../service/task.api.service';
import { Task } from '../task';

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
}
