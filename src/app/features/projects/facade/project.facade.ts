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
    return this.projectApiService.getAllProjects();
  }
  getProjectsWithRange(limit: number, offset: number) {
    return this.projectApiService.getProjectsWithRange(limit, offset);
  }
}
