import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../../projects/model/project';
import { ProjectFacade } from '../../../../projects/facade/project.facade';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-empty-epics',
  standalone: true,
  imports: [],
  templateUrl: './empty-epics.component.html',
})
export class EmptyEpicsComponent implements OnInit, OnDestroy {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  projectFacade = inject(ProjectFacade);
  project = signal<Project>({});
  destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.getCurrentProject();
  }

  private getCurrentProject() {
    if (sessionStorage.getItem('project')) {
      this.project.set(JSON.parse(sessionStorage.getItem('project')!));
    } else {
      const val = this.activatedRoute.snapshot.url[1].toString();
      this.projectFacade
        .getProject(val)
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => {
          this.project.set(val!);
          sessionStorage.setItem('project', JSON.stringify(val));
        });
    }
  }

  navigateToNewEpic() {
    this.router.navigateByUrl(`/project/${this.project().id}/epics/new`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
