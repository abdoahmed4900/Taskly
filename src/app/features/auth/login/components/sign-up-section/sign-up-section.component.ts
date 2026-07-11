import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up-section',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section
      class="login-navigation-section flex-wrap items-center justify-center md:border-t md:border-[#C3C6D626] pt-8 md:mt-8 mt-41.75 flex flex-row gap-1 mx-12.5 md:mx-20.75"
    >
      <p
        class="font-normal text-[0.875rem] leading-5 tracking-normal text-center text-(--slate-nature-second)"
      >
        Don't have an account?
      </p>
      <a
        routerLink="/sign-up"
        class="font-semibold cursor-pointer text-[0.875rem] mx-2 md:mx-0 leading-5 tracking-normal text-center text-(--primary)"
      >
        Sign Up
      </a>
    </section>
  `,
})
export class SignUpSectionComponent {}
