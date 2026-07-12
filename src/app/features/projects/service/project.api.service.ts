import { Injectable, inject } from '@angular/core';
import { Project } from '../model/project';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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

  getAllProjects() {
    return this.httpClient.get('rest/v1/rpc/get_projects').pipe(
      map(val => {
        return JSON.parse(JSON.stringify(val)).map((i: unknown) => {
          const x = i as {
            name: string;
            description: string;
            created_at: string;
          };
          return {
            name: x.name,
            description: x.description,
            createdAt: x.created_at.split('T')[0],
          } as Project;
        });
      }),
    );
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
}
