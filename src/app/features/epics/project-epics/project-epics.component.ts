import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EpicsFacade } from '../facade/epics.facade';
import { EmptyEpicsComponent } from './components/empty-epics/empty-epics.component';
import { Project } from '../../projects/model/project';
import { ToastService } from '../../../shared/service/toast.service';
import { EpicsListComponent } from './components/epics-list/epics-list.component';
import { EpicsListHeaderComponent } from './components/epics-list-header/epics-list-header.component';

@Component({
  selector: 'app-project-epics',
  standalone: true,
  imports: [EmptyEpicsComponent, EpicsListComponent, EpicsListHeaderComponent],
  templateUrl: './project-epics.component.html',
  styleUrl: './project-epics.component.css',
})
export class ProjectEpicsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  value = '';
  project = signal<Project>({});
  epicsFacade = inject(EpicsFacade);
  toastService = inject(ToastService);
  destroy$ = new Subject<void>();
  epicsLength = signal(0);
  isLoading = signal(false);

  ngOnInit(): void {
    this.value = this.route.snapshot.url.at(1)!.toString();
    if (sessionStorage.getItem('project')) {
      this.project.set(JSON.parse(sessionStorage.getItem('project')!));
    } else {
      this.project.set({
        id: this.value,
      });
    }
    this.isLoading.set(true);
    this.epicsFacade
      .getProjectEpics(this.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          setTimeout(() => {
            this.isLoading.set(false);
          }, 1000);
          this.epicsLength.set(value.length);
        },
        error: () => {
          setTimeout(() => {
            this.isLoading.set(false);
          }, 1000);
          this.toastService.error('Failed to get project epics.try later');
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
