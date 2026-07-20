import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EpicsFacade } from '../facade/epics.facade';
import { EmptyEpicsComponent } from './components/empty-epics/empty-epics.component';
import { Epic } from '../epic';
import { Project } from '../../projects/model/project';
import { EpicModalComponent } from '../components/modal/modal.component';

@Component({
  selector: 'app-project-epics',
  standalone: true,
  imports: [EmptyEpicsComponent, RouterLink, EpicModalComponent],
  templateUrl: './project-epics.component.html',
  styleUrl: './project-epics.component.css',
})
export class ProjectEpicsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  value = '';
  project = signal<Project>({});
  destroy$ = new Subject<void>();
  epicsFacade = inject(EpicsFacade);
  isModalOpen = signal(false);
  initials = computed(() => {
    let val = '';
    const words = this.project().name!.split(' ');
    if (words.length > 1) {
      words.map(word => {
        val += word.charAt(0);
      });
    } else {
      val = words[0].substring(0, 2);
    }

    return val;
  });

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  totalEpics = signal<number>(0);
  rangeStart = signal<number>(0);
  rangeEnd = signal<number>(0);
  currentEpics = signal<Epic[]>([]);
  allPages = signal<number[]>([]);
  currentPages = signal<number[]>([]);
  epicsPerPage = signal(2);
  currentPage = signal(1);
  isLoading = signal(false);

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      this.isLoading() ||
      this.currentPage() >= this.allPages().length ||
      window.innerWidth >= 1024
    ) {
      return;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
      this.nextPage();
    }
  }

  @HostListener('window:resize', [])
  onWidthChanged() {
    if (window.innerWidth >= 1024) {
      this.value = this.route.snapshot.url.at(1)!.toString();
      this.initializePagination();
    }
  }

  ngOnInit(): void {
    this.project.set(JSON.parse(sessionStorage.getItem('project')!));
    this.value = this.route.snapshot.url.at(1)!.toString();
    this.isLoading.set(true);
    this.initializePagination();
  }

  private initializePagination() {
    this.epicsFacade
      .getProjectEpicsWithRange(this.value, this.epicsPerPage(), 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: val => {
          this.currentEpics.set(val.epics);
          this.totalEpics.set(val.totalEpics);
          this.rangeStart.set(Number(val.rangeStart));
          this.rangeEnd.set(Number(val.rangeEnd) + 1);
          for (
            let index = 1;
            index <= Math.ceil(this.totalEpics() / this.epicsPerPage());
            index++
          ) {
            this.allPages().push(index);
          }
          this.currentPages.set(this.allPages().slice(0, 2));
          this.currentPage.set(1);
          this.isLoading.set(false);
          this.currentEpics.set(val.epics);
        },
        error: () => {
          this.isLoading.set(false);
          console.log('project doesnt exist');
        },
      });
  }

  previousPage() {
    if (this.currentPage() == 1) {
      return;
    }
    this.isLoading.set(true);
    this.currentPage.update(v => v - 1);
    this.epicsFacade
      .getProjectEpicsWithRange(
        this.project().id!,
        this.epicsPerPage(),
        (this.currentPage() - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.set(false);
        this.currentEpics.set(val.epics);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        if (this.currentPage() % this.epicsPerPage() == 0) {
          this.currentPages.set([this.currentPage() - 1, this.currentPage()]);
        }
      });
  }
  goToPage(index: number) {
    this.isLoading.set(true);
    this.currentPage.set(index);
    this.epicsFacade
      .getProjectEpicsWithRange(
        this.project().id!,
        this.epicsPerPage(),
        (index - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.set(false);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        this.currentEpics.set(val.epics);
      });
  }
  nextPage() {
    if (this.currentPage() >= this.allPages().length) {
      return;
    }

    this.isLoading.set(true);
    this.currentPage.update(v => v + 1);
    this.epicsFacade
      .getProjectEpicsWithRange(
        this.value,
        this.epicsPerPage(),
        (this.currentPage() - 1) * this.epicsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.set(false);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        if (window.innerWidth < 1024) {
          this.currentEpics.set([...this.currentEpics(), ...val.epics]);
        } else {
          if (this.currentPage() % 2 == 1) {
            this.currentPages.set(
              this.currentPage() >= this.allPages()[this.allPages().length - 1]
                ? [this.currentPage()]
                : [this.currentPage(), this.currentPage() + 1],
            );
          }
          this.currentEpics.set(val.epics);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
