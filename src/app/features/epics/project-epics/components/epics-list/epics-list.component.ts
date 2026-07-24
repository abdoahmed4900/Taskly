import { PaginationService } from './../../../../../shared/service/pagination.service';
import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Project } from '../../../../projects/model/project';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Epic } from '../../../epic';
import { Subject, takeUntil } from 'rxjs';
import { ProjectFacade } from '../../../../projects/facade/project.facade';
import { ToastService } from '../../../../../shared/service/toast.service';
import { EpicsFacade } from '../../../facade/epics.facade';
import { ProjectEpicModalComponent } from '../epic-modal/epic.modal.component';
import { EpicsListHeaderComponent } from '../epics-list-header/epics-list-header.component';
import { EpicsPaginationContainerComponent } from '../epics-pagination-container/epics-pagination-container.component';
import { EpicItemHeaderComponent } from '../epic-item-header/epic-item-header.component';
import { EpicItemAssigneeComponent } from '../epic-item-assignee/epic-item-assignee.component';
import { EpicItemCreatebyComponent } from '../epic-item-createby/epic-item-createby.component';

@Component({
  selector: 'app-epics-list',
  standalone: true,
  providers: [PaginationService],
  imports: [
    RouterLink,
    ProjectEpicModalComponent,
    EpicsListHeaderComponent,
    EpicsPaginationContainerComponent,
    EpicItemHeaderComponent,
    EpicItemAssigneeComponent,
    EpicItemCreatebyComponent,
  ],
  templateUrl: './epics-list.component.html',
})
export class EpicsListComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  value = '';
  project = signal<Project>({});
  destroy$ = new Subject<void>();
  projectsFacade = inject(ProjectFacade);
  paginationService = inject(PaginationService);
  toastService = inject(ToastService);
  epicsFacade = inject(EpicsFacade);
  isModalOpen = signal(false);
  selectedEpic = signal<Epic>({});

  openModal(isModalOpen: boolean) {
    this.isModalOpen.set(isModalOpen);
  }

  updateChangedEpic() {
    this.paginationService.goToPage(this.paginationService.currentPage());
  }

  totalEpics = signal<number>(0);
  rangeEnd = signal<number>(0);
  currentEpics = signal<Epic[]>([]);
  isLoading = signal(false);
  isInfiniteScroll = signal(window.innerWidth < 1024);
  @HostListener('window:resize')
  onResize() {
    this.isInfiniteScroll.set(window.innerWidth < 1024);
  }

  @HostListener('window:resize', [])
  onWidthChanged() {
    if (window.innerWidth >= 1024) {
      this.value = this.route.snapshot.url.at(1)!.toString();
      this.paginationService.goToPage(this.paginationService.currentPage());
    }
  }

  ngOnInit(): void {
    this.value = this.route.snapshot.url.at(1)!.toString();
    if (sessionStorage.getItem('project')) {
      this.project.set(JSON.parse(sessionStorage.getItem('project')!));
    } else {
      this.projectsFacade
        .getProject(this.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: value => {
            this.project.set({
              ...value,
            });
          },
        });
    }
  }

  getCurrentEpics(epics: Epic[]) {
    this.currentEpics.set(epics);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
