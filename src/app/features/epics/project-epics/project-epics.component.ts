import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EpicsFacade } from '../facade/epics.facade';

@Component({
  selector: 'app-project-epics',
  standalone: true,
  imports: [],
  templateUrl: './project-epics.component.html',
  styleUrl: './project-epics.component.css',
})
export class ProjectEpicsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  value = '';
  destroy$ = new Subject<void>();
  epicsFacade = inject(EpicsFacade);

  ngOnInit(): void {
    this.value = this.route.snapshot.url.at(1)!.toString();
    this.epicsFacade
      .getProjectEpics(this.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('epics are gotten!');
        },
        error: () => {
          console.log('project doesnt exist');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
