import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../../../projects/model/project';

@Component({
  selector: 'app-empty-epics',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-epics.component.html',
})
export class EmptyEpicsComponent implements OnInit {
  router = inject(Router);
  project = signal<Project>({});
  ngOnInit(): void {
    console.log(JSON.stringify(history.state!['project']));
    this.project.set(history.state!['project']);
  }

  navigateToNewEpic() {
    this.router.navigateByUrl(`/project/${this.project().id}/epics/new`, {
      state: {
        project: this.project(),
      },
    });
  }
}
