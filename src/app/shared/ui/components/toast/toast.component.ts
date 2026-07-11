import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../service/toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div
      class="fixed z-9999 top-4 left-1/2 transition-all -translate-x-1/2 lg:left-auto lg:right-4 lg:translate-x-0 flex  flex-col gap-3 w-[92%] max-w-sm"
    >
      @for (toast of toast.toasts(); track toast.id) {
        <div
          class="animate-[toastIn_.25s_ease] rounded-xl shadow-xl p-4 flex items-center text-white gap-3"
          [class]="color(toast.type)"
        >
          <div class="text-xl font-bold">
            {{ icon(toast.type) }}
          </div>

          <div class="flex-1">
            <h3 class="font-semibold">
              {{ toast.title }}
            </h3>

            @if (toast.message) {
              <p class="text-sm text-slate-500 mt-1">
                {{ toast.message }}
              </p>
            }
          </div>

          <button class="text-white" (click)="remove(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes toastIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  selector: 'app-toast-component',
})
export class ToastComponent {
  toast = inject(ToastService);

  remove(id: number) {
    this.toast.remove(id);
  }

  color(type: string) {
    switch (type) {
      case 'success':
        return 'bg-green-500';

      case 'error':
        return 'bg-red-500';

      case 'warning':
        return 'bg-yellow-500';

      default:
        return 'bg-blue-500';
    }
  }

  icon(type: string) {
    switch (type) {
      case 'success':
        return '✓';

      case 'error':
        return '✕';

      case 'warning':
        return '⚠';

      default:
        return 'ℹ';
    }
  }
}
