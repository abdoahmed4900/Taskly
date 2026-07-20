import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EpicsFacade } from '../facade/epics.facade';
import { EmptyEpicsComponent } from './components/empty-epics/empty-epics.component';
import { Epic } from '../epic';
import { Project } from '../../projects/model/project';

@Component({
  selector: 'app-project-epics',
  standalone: true,
  imports: [EmptyEpicsComponent, RouterLink],
  templateUrl: './project-epics.component.html',
  styleUrl: './project-epics.component.css',
})
export class ProjectEpicsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  value = '';
  project = signal<Project>({});
  destroy$ = new Subject<void>();
  epicsFacade = inject(EpicsFacade);
  epics = signal<Epic[]>([]);
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

  ngOnInit(): void {
    this.project.set(JSON.parse(sessionStorage.getItem('project')!));
    this.value = this.route.snapshot.url.at(1)!.toString();
    this.epicsFacade
      .getProjectEpics(this.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: val => {
          console.log(JSON.stringify(val));

          this.epics.set(val);
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
