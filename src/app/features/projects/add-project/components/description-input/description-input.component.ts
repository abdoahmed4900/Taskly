import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-description-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="description-area-container flex flex-col">
      <div class="label flex flex-row justify-between items-center">
        <label
          [class.text-(--error)!]="control()!.invalid && control()!.touched"
          for="name"
          class="form-control-label"
          >Description</label
        >
        <p class="font-normal text-[0.7rem] leading-4 tracking-normal lg:block hidden align-middle">
          Optional
        </p>
      </div>
      <textarea
        [formControl]="control()!"
        type="text"
        class="form-control h-50 resize-none"
        rows="10"
        placeholder="Provide a high-level overview of the project's architectural objectives and 
key milestones..."
        [class.bg-(--form-control-error-bg)]="control()!.invalid && control()!.touched"
        [class.outline-(--primary)]="control()!.valid && control()!.touched"
        [class.outline-(--form-control-error-bg)]="control()!.invalid && control()!.touched"
        [class.focus:outline-(--form-control-error-bg)]="control()!.invalid && control()!.touched"
      ></textarea>

      <ng-content></ng-content>

      <p class="mt-2 self-end font-medium text-[0.69rem] tracking-normal">
        {{ control()!.value.length }} / 500 <span class="hidden lg:inline-block">characters</span>
      </p>
    </section>
  `,
})
export class DescriptionInputComponent {
  control = input<FormControl>();
}
