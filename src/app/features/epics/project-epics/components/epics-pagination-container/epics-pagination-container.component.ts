import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EpicsFacade } from '../../../facade/epics.facade';
import { ProjectFacade } from '../../../../projects/facade/project.facade';
import { Epic } from '../../../epic';
import { PaginationService } from '../../../../../shared/service/pagination.service';

@Component({
  selector: 'app-epics-pagination-container',
  standalone: true,
  imports: [],
  templateUrl: './epics-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpicsPaginationContainerComponent implements OnInit {
  paginationService = inject(PaginationService);
  currentPages = computed(() => {
    return this.paginationService.currentPages();
  });
  currentPage = computed(() => {
    return this.paginationService.currentPage();
  });
  rangeEnd = signal<number>(0);
  totalEpics = signal<number>(0);
  currentEpics = signal<Epic[]>([]);
  isLoading = output<boolean>();
  epicsPerPage = computed(() => {
    return this.paginationService.itemsPerPage();
  });
  projectId = model<string>();
  epicsFacade = inject(EpicsFacade);
  allPages = computed(() => {
    return this.paginationService.allPages();
  });
  project = signal({});
  projectFacade = inject(ProjectFacade);
  destroy$ = new Subject<void>();
  currentEpicsEmitter = output<Epic[]>();
  infiniteScroll = input(false);

  initializePagination() {
    this.epicsFacade
      .getProjectEpicsWithRange(this.projectId()!, this.epicsPerPage(), 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: val => {
          this.currentEpics.set(val.epics);
          this.totalEpics.set(Number(val.totalEpics));
          this.rangeEnd.set(Number(val.rangeEnd) + 1);
          this.paginationService.initializePagination(this.totalEpics());
          this.currentEpicsEmitter.emit(this.currentEpics());
        },
        error: () => {
          console.log('project doesnt exist');
        },
      });
  }

  private getProject() {
    this.projectFacade
      .getProject(this.projectId()!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: p => {
          sessionStorage.setItem('project', JSON.stringify(p));
          this.project.set(p!);
        },
        error: () => {
          console.log('e');
        },
      });
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!this.infiniteScroll()) {
      return;
    }

    if (this.totalEpics() === this.currentEpics().length) {
      return;
    }

    const threshold = 100;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold) {
      this.nextPage();
    }
  }
  ngOnInit(): void {
    this.getProject();
    this.initializePagination();
  }
  previousPage() {
    if (this.currentPage() == 1) {
      return;
    }
    this.isLoading.emit(true);
    this.paginationService.previousPage();
    this.epicsFacade
      .getProjectEpicsWithRange(
        this.projectId()!,
        this.epicsPerPage(),
        (this.currentPage()! - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.emit(false);
        this.currentEpics.set(val.epics);
        this.totalEpics.set(val.totalEpics);
        this.currentEpicsEmitter.emit(this.currentEpics());
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
      });
  }
  goToPage(index: number) {
    this.isLoading.emit(true);
    this.paginationService.goToPage(index);
    this.epicsFacade
      .getProjectEpicsWithRange(
        this.projectId()!,
        this.epicsPerPage(),
        (index - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.emit(false);
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        this.currentEpics.set(val.epics);
        this.currentEpicsEmitter.emit(this.currentEpics());
      });
  }
  nextPage() {
    if (this.currentPage() >= this.allPages().length) {
      return;
    }
    this.paginationService.nextPage();

    this.isLoading.emit(true);
    this.epicsFacade
      .getProjectEpicsWithRange(
        this.projectId()!,
        this.epicsPerPage(),
        (this.currentPage()! - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.emit(false);
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        if (this.infiniteScroll()) {
          this.currentEpics.update(epics => [...epics, ...val.epics]);
        } else {
          this.currentEpics.set(val.epics);
        }
        this.currentEpicsEmitter.emit(this.currentEpics());
      });
  }
}
