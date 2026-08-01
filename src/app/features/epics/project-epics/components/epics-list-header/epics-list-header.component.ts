import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Project } from '../../../../projects/model/project';
import { RouterLink } from '@angular/router';
import { EpicsFacade } from '../../../facade/epics.facade';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Epic } from '../../../epic';
import { ToastService } from '../../../../../shared/service/toast.service';

@Component({
  selector: 'app-epics-list-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="lg:flex flex-row justify-between hidden">
      <div class="flex flex-col gap-4">
        <div class="lg:flex hidden flex-row items-center justify-start gap-2">
          <a
            routerLink="/projects"
            class="font-bold text-[0.75rem] uppercase tracking-[1.2px] leading-4 align-middle text-[#43465499]"
          >
            PROJECTS
          </a>
          <svg
            width="4"
            height="6"
            viewBox="0 0 4 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.3 3L0 0.7L0.7 0L3.7 3L0.7 6L0 5.3L2.3 3Z"
              fill="#434654"
              fill-opacity="0.4"
            />
          </svg>
          <p
            class="font-bold text-[0.75rem] uppercase tracking-[1.2px] leading-4 align-middle text-[#43465499]"
          >
            {{ project()!.name ? project()!.name : 'PROJECT TITLE' }}
          </p>
          <svg
            width="4"
            height="6"
            viewBox="0 0 4 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.3 3L0 0.7L0.7 0L3.7 3L0.7 6L0 5.3L2.3 3Z"
              fill="#434654"
              fill-opacity="0.4"
            />
          </svg>
          <p
            class="font-bold text-[0.75rem] uppercase tracking-[1.2px] leading-4 align-middle text-(--primary)"
          >
            Epics
          </p>
        </div>
        <p
          class="font-bold text-[1.875rem] leading-9 align-middle tracking-[-0.75px] text-(--slate-nature-first)"
        >
          Project Epics
        </p>
      </div>
      <div class="flex flex-row gap-8 mt-5">
        <input
          type="search"
          class="form-control"
          placeholder="Search epics..."
          (input)="search($event)"
          #searchField
        />
        <button class="flex bg-(--primary) flex-row gap-2 w-50 rounded-lg items-center px-6 py-3">
          <span
            ><svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.5 6H0V4.5H4.5V0H6V4.5H10.5V6H6V10.5H4.5V6Z" fill="white" />
            </svg>
          </span>
          <a
            [routerLink]="['/project', project()!.id, 'epics', 'new']"
            class="text-white cursor-pointer"
            >New Epic</a
          >
        </button>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpicsListHeaderComponent implements OnDestroy {
  project = model<Project>();
  epicFacade = inject(EpicsFacade);
  projectName = input<string>();
  destroy$ = new Subject<void>();
  searchTerm = signal<string>('');
  searchTermOutput = output<string>();
  toastService = inject(ToastService);
  searchField = viewChild<ElementRef<HTMLElement>>('searchField');
  epicsOutput = output<{
    epics: Epic[];
    totalProjects: number;
    rangeStart: number;
    rangeEnd: number;
  }>();

  search(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchTermOutput.emit(value);
    this.searchEpic();
  }

  searchEpic() {
    this.epicFacade
      .searchEpic(this.project()!.id!, this.searchTerm(), 2, 0)
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.epicsOutput.emit(value);
        },
        error: () => {
          this.toastService.error('Failed to get epics!');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
