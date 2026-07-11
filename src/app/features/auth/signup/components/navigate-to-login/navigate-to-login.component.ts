import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigate-to-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section
      class="login-navigation-section md:pt-8 pt-12 pb-8 md:pb-0 flex flex-row gap-1 mt-auto justify-center"
    >
      <p
        class="font-normal text-[0.875rem] leading-5 tracking-normal text-center text-(--slate-nature-second)"
      >
        Already have an account?
      </p>
      <a
        routerLink="/login"
        class="font-normal cursor-pointer text-[0.875rem] leading-5 tracking-normal text-center text-(--primary)"
      >
        Log in
      </a>
    </section>
  `,
})
export class NavigateToLoginComponent {}
