import { Component, model } from '@angular/core';
import { Member } from '../../../member';

@Component({
  selector: 'app-members-list-mobile-component',
  standalone: true,
  template: `
    <section class="lg:hidden flex flex-col gap-3">
      @for (item of members(); track item.memberId) {
        <div
          class="flex flex-row bg-white p-3 items-center gap-4 whitespace-nowrap justify-between rounded-lg"
        >
          <div class="user-info flex flex-row gap-3 items-center">
            <p
              class="font-bold text-[0.875rem] leading-5 tracking-normal text-center align-middle bg-[#DAE2FF] text-(--primary) rounded-xl py-3.5 px-3.25"
            >
              {{ getNameInitials(item.name) }}
            </p>
            <div class="flex flex-col">
              <p class="font-semibold text-[0.875rem] leading-5 tracking-normal align-middle">
                {{ item.name }}
              </p>
              <p class="font-normal text-[0.75rem] leading-4 tracking-normal align-middle">
                {{ item.email }}
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-2 my-1.25 items-end">
            <p
              class="font-bold rounded-xs text-[0.625rem] leading-3.75 align-middle tracking-[-0.25px] uppercase text-(--paragraph-text-common-color) bg-(--form-control-bg) px-2 py-0.5"
            >
              {{ item.role }}
            </p>
            @if (item.role !== 'owner') {
              <svg
                width="4"
                height="16"
                viewBox="0 0 4 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z"
                  fill="#434654"
                />
              </svg>
            }
          </div>
        </div>
      }
    </section>
  `,
})
export class MembersListMobile {
  members = model<Member[]>([]);
  getNameInitials(val: string) {
    let initials = '';
    const words = val.split(' ');
    console.log(words);

    if (words.length > 1) {
      words.map(word => {
        initials += word.charAt(0);
        console.log(`val + ${val}`);
      });
    } else {
      initials = words[0].substring(0, 2);
    }
    console.log(val);

    return initials;
  }
}
