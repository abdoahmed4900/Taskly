import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../projects/model/project';

@Component({
  selector: 'app-empty-epics',
  standalone: true,
  imports: [],
  templateUrl: './empty-epics.component.html',
})
export class EmptyEpicsComponent implements OnInit {
  router = inject(Router);
  project = signal<Project>({});
  ngOnInit(): void {
    sessionStorage.setItem('project', JSON.stringify(this.project()));
  }

  navigateToNewEpic() {
    this.router.navigateByUrl(`/project/${this.project().id}/epics/new`);
  }
}
