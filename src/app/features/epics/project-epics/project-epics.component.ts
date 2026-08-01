import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EpicsFacade } from '../facade/epics.facade';
import { EmptyEpicsComponent } from './components/empty-epics/empty-epics.component';
import { Project } from '../../projects/model/project';
import { ToastService } from '../../../shared/service/toast.service';
import { EpicsListComponent } from './components/epics-list/epics-list.component';
import { EpicsListHeaderComponent } from './components/epics-list-header/epics-list-header.component';
import { Epic } from '../epic';

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
  rangeEnd = signal(0);
  isLoading = signal(false);
  totalEpics = signal<Epic[]>([]);
  currentEpics = signal<Epic[]>([]);
  searchTerm = signal('');

  setCurrentEpics(val: { totalProjects: number; rangeEnd: number; epics: Epic[] }) {
    console.log('set current epics called');

    this.epicsLength.set(val.totalProjects);
    this.currentEpics.set(val.epics);
    this.rangeEnd.set(val.rangeEnd);
    console.log(val);
  }

  setSearchTerm(val: string) {
    this.searchTerm.set(val);
  }

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
      .searchEpic(this.value, '', 2, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          setTimeout(() => {
            this.isLoading.set(false);
          }, 1000);
          console.log(value);

          this.setCurrentEpics(value);
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
