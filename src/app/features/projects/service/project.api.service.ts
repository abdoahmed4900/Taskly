import { Injectable, inject } from '@angular/core';
import { Project } from '../model/project';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Task, TaskStatus } from '../../tasks/task';
import { Assignee, CreatedBy } from '../../epics/epic';

@Injectable({
  providedIn: 'root',
})
export class ProjectApiService {
  httpClient = inject(HttpClient);
  addNewProject(project: Project) {
    return this.httpClient.post('rest/v1/projects', {
      name: project.name,
      description: project.description,
    });
  }

  editProject(id: string, project: Project) {
    return this.httpClient.patch(`rest/v1/projects?id=eq.${id}`, {
      name: project.name,
      description: project.description,
    });
  }

  getAllProjects() {
    return this.httpClient.get('rest/v1/rpc/get_projects');
  }
  getProjectsWithRange(limit: number, offset: number) {
    return this.httpClient
      .get(`rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`, {
        observe: 'response',
        headers: {
          Prefer: 'count=exact',
        },
      })
      .pipe(
        map(val => {
          const projects = JSON.parse(JSON.stringify(val.body)).map((i: unknown) => {
            const x = i as {
              name: string;
              id: string;
              description: string;
              created_at: string;
            };
            return {
              name: x.name,
              description: x.description,
              id: x.id,
              createdAt: x.created_at.split('T')[0],
            } as Project;
          }) as Project[];

          return {
            projects: projects,
            totalProjects: val.headers.get('Content-Range')?.split('/')[1],
            rangeStart: val.headers.get('Content-Range')?.split('/')[0].split('-')[0],
            rangeEnd: val.headers.get('Content-Range')?.split('/')[0].split('-')[1],
          };
        }),
      );
  }

  getProjectTasks(projectId: string) {
    return this.httpClient.get(`rest/v1/project_tasks?project_id=eq.${projectId}`).pipe(
      map(t => {
        const tasks = t as {
          id: string;
          project_id: string;
          epic_id: string;
          title: string;
          description: string;
          status: string;
          created_at: string;
          due_date: string | null;
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
            dueDate: task.due_date ? task.due_date.split('T')[0] : '',
            taskId: task.task_id,
            assignee: task.assignee,
          } as Task;
        });
        return newTasks;
      }),
    );
  }
}
