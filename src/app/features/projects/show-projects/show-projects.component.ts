import { ProjectFacade } from './../facade/project.facade';
import { Component, HostListener, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Project } from '../model/project';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-projects',
  standalone: true,
  imports: [RouterLink],
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
  isLoaded = signal(false);
  currentPage = signal(1);

  constructor() {
    effect(() => {
      console.log(this.rangeEnd());
      console.log(this.totalProjects());
    });
  }

  ngOnInit(): void {
    this.projectFacade
      .getProjectsWithRange(
        this.projectsPerPage(),
        (this.currentPage() - 1) * this.projectsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.totalProjects.set(Number(val.totalProjects));
        for (let index = 1; index <= this.totalProjects() / this.projectsPerPage(); index++) {
          this.allPages().push(index);
        }
        this.currentPages.set(this.allPages().slice(0, 2));
        this.currentProjects.set(val.projects);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        this.currentPage.set(1);
        this.isLoaded.set(true);
        console.log(`${JSON.stringify(val)}`);
      });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      this.currentProjects().length < this.totalProjects() &&
      window.innerWidth < 768
    ) {
      console.log('On Scroll Down');
      this.nextPage();
    }
  }

  previousPage() {
    this.isLoaded.set(false);
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
        if (this.currentPage() % 2 == 0) {
          this.currentPages.set(this.allPages().slice(this.currentPage() - 2, this.currentPage()));
        }
        console.log(this.currentPage());
        console.log(this.currentPages());

        this.isLoaded.set(true);
        console.log(`${JSON.stringify(val)}`);
      });
  }
  goToPage(index: number) {
    this.isLoaded.set(false);
    this.currentPage.set(index);
    this.projectFacade
      .getProjectsWithRange(this.projectsPerPage(), (index - 1) * this.projectsPerPage())
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoaded.set(true);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        this.currentProjects.set(val.projects);

        console.log(`${JSON.stringify(val)}`);
      });
  }
  nextPage() {
    this.isLoaded.set(false);
    this.currentPage.update(v => v + 1);
    this.projectFacade
      .getProjectsWithRange(
        this.projectsPerPage(),
        (this.currentPage() - 1) * this.projectsPerPage(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.isLoaded.set(true);
        this.rangeStart.set(Number(val.rangeStart));
        this.rangeEnd.set(Number(val.rangeEnd) + 1);
        if (window.innerWidth < 1024) {
          this.currentProjects.set([...this.currentProjects(), ...val.projects]);
        } else {
          this.currentProjects.set(val.projects);
        }
        if (this.currentPage() % 2 == 1) {
          this.currentPages.set(
            this.allPages().slice(this.currentPage() - 1, this.currentPage() + 1),
          );
        }
        console.log(this.currentPage());
        console.log(this.currentPages());

        console.log(`${JSON.stringify(val)}`);
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
