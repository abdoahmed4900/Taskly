import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectApiService {
  httpClient = inject(HttpClient);
  // addNewProject(project: Project) {
  //   return this.httpClient.post('')
  // }
}
