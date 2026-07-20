import { ProjectFacade } from './../facade/project.facade';
import { Component, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Project } from '../model/project';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-projects',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './show-projects.component.html',
  styleUrl: './show-projects.component.css',
})
export class ShowProjectsComponent implements OnInit, OnDestroy {
  projects$!: Observable<Project[]>;
  projectFacade = inject(ProjectFacade);
  totalProjects = signal<number>(0);
  rangeStart = signal<number>(0);
  rangeEnd = signal<number>(0);
  destroy$ = new Subject<void>();
  currentProjects = signal<Project[]>([]);
  allPages = signal<number[]>([]);
  currentPages = signal<number[]>([]);
  projectsPerPage = signal(2);
  isLoading = signal(false);
  currentPage = signal(1);
  router = inject(Router);

  ngOnInit(): void {
    this.projectFacade
      .getProjectsWithRange(
        this.projectsPerPage(),
        (this.currentPage() - 1) * this.projectsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.totalProjects.set(Number(val.totalProjects));
        for (
          let index = 1;
          index <= Math.ceil(this.totalProjects() / this.projectsPerPage());
          index++
        ) {
          this.allPages().push(index);
        }

        this.currentPages.set(this.allPages().slice(0, 2));
        this.currentProjects.set(val.projects);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        this.currentPage.set(1);
        this.isLoading.set(true);
      });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      !this.isLoading() ||
      window.innerWidth >= 1024 ||
      this.currentPage() >= this.allPages().length
    ) {
      return;
    }

    const threshold = 100;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold) {
      this.nextPage();
    }
  }

  goToEpicsPage(item: Project) {
    sessionStorage.setItem('project', JSON.stringify(item));
    this.router.navigate([`/project/${item.id}/epics`]);
  }

  previousPage() {
    if (this.currentPage() == 1) {
      return;
    }
    this.isLoading.set(false);
    this.currentPage.update(v => v - 1);
    this.projectFacade
      .getProjectsWithRange(
        this.projectsPerPage(),
        (this.currentPage() - 1) * this.projectsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.currentProjects.set(val.projects);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        if (this.currentPage() % this.projectsPerPage() == 0) {
          this.currentPages.set([this.currentPage() - 1, this.currentPage()]);
        }
        this.isLoading.set(true);
      });
  }
  goToPage(index: number) {
    this.isLoading.set(false);
    this.currentPage.set(index);
    this.projectFacade
      .getProjectsWithRange(this.projectsPerPage(), (index - 1) * this.projectsPerPage())
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.set(true);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        this.currentProjects.set(val.projects);
      });
  }
  nextPage() {
    if (this.currentPage() >= this.allPages().length) {
      return;
    }

    this.isLoading.set(true);
    this.currentPage.update(v => v + 1);
    this.projectFacade
      .getProjectsWithRange(
        this.projectsPerPage(),
        (this.currentPage() - 1) * this.projectsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoading.set(false);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        if (window.innerWidth < 1024) {
          this.currentProjects.set([...this.currentProjects(), ...val.projects]);
        } else {
          if (this.currentPage() % 2 == 1) {
            this.currentPages.set(
              this.currentPage() >= this.allPages()[this.allPages().length - 1]
                ? [this.currentPage()]
                : [this.currentPage(), this.currentPage() + 1],
            );
          }
          this.currentProjects.set(val.projects);
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
