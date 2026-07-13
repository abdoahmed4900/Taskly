import { Observable, map } from 'rxjs';
import { Project } from '../model/project';
import { ProjectApiService } from './../service/project.api.service';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectFacade {
  projectApiService = inject(ProjectApiService);
  addNewProject(project: Project) {
    return this.projectApiService.addNewProject(project);
  }
  getAllProjects() {
    return this.projectApiService.getAllProjects().pipe(
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
        }) as Project[];
      }),
    ) as Observable<Project[]>;
  }
  getProjectsWithRange(limit: number, offset: number) {
    return this.projectApiService.getProjectsWithRange(limit, offset);
  }
  getProject(id: string) {
    return this.getAllProjects().pipe(
      map(projects => {
        return projects.filter(p => p.id != id).at(0);
      }),
    );
  }

  editProject(id: string, project: Project) {
    return this.projectApiService.editProject(id, project);
  }
}
