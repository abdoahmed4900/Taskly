import { ChangeDetectionStrategy, Component, effect, input, model } from '@angular/core';
import { Project } from '../../../../projects/model/project';
import { RouterLink } from '@angular/router';

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
        <input type="search" class="form-control" placeholder="Search epics..." />
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
export class EpicsListHeaderComponent {
  project = model<Project>();
  constructor() {
    effect(() => {
      console.log(this.project());
    });
  }
  projectName = input<string>();
}
