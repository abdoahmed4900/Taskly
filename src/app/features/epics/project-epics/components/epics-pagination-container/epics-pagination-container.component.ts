import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  effect,
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
  totalEpics = model<number>(0);
  currentEpics = model<Epic[]>([]);
  isLoadingOutput = output<boolean>();
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
  searchTerm = input('');
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

    if (this.currentPage() == this.allPages().length) {
      return;
    }

    const threshold = 100;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold) {
      this.nextPage();
    }
  }

  constructor() {
    effect(
      () => {
        this.paginationService.initializePagination(this.totalEpics()!);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.getProject();
    console.log(this.totalEpics());
    console.log(this.currentEpics().length);
  }
  previousPage() {
    if (this.currentPage() == 1) {
      return;
    }
    this.isLoadingOutput.emit(true);
    this.paginationService.previousPage();
    this.epicsFacade
      .searchEpic(
        this.projectId()!,
        this.searchTerm(),
        this.paginationService.itemsPerPage(),
        (this.currentPage() - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoadingOutput.emit(false);
        this.currentEpics.set(val.epics);
        this.totalEpics.set(val.totalProjects);
        this.currentEpicsEmitter.emit(this.currentEpics());
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
      });
  }
  goToPage(index: number) {
    this.isLoadingOutput.emit(true);
    this.paginationService.goToPage(index);
    this.epicsFacade
      .searchEpic(
        this.projectId()!,
        this.searchTerm(),
        this.paginationService.itemsPerPage(),
        (index - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoadingOutput.emit(false);
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        this.currentEpics.set(val.epics);
        this.totalEpics.set(val.totalProjects);
        this.currentEpicsEmitter.emit(this.currentEpics());
      });
  }
  nextPage() {
    if (this.currentPage() - 1 >= this.allPages().length) {
      return;
    }
    this.paginationService.nextPage();

    this.isLoadingOutput.emit(true);
    this.epicsFacade
      .searchEpic(
        this.projectId()!,
        this.searchTerm(),
        this.paginationService.itemsPerPage(),
        (this.currentPage() - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.totalEpics.set(val.totalProjects);
        this.isLoadingOutput.emit(false);
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        if (this.infiniteScroll()) {
          this.currentEpics.update(epics => [...epics, ...val.epics]);
        } else {
          this.currentEpics.set(val.epics);
        }
        this.totalEpics.set(val.totalProjects);
        this.currentEpicsEmitter.emit(this.currentEpics());
      });
  }
}
