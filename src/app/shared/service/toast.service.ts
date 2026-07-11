import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private counter = 0;

  toasts = signal<Toast[]>([]);

  show(title: string, message = '', type: ToastType = 'info', duration = 4000) {
    const toast: Toast = {
      id: ++this.counter,
      title,
      message,
      type,
      duration,
    };

    this.toasts.update(x => [...x, toast]);

    setTimeout(() => this.remove(toast.id), duration);
  }

  remove(id: number) {
    this.toasts.update(x => x.filter(t => t.id !== id));
  }

  success(title: string, message = '') {
    this.show(title, message, 'success');
  }

  error(title: string, message = '') {
    this.show(title, message, 'error');
  }

  warning(title: string, message = '') {
    this.show(title, message, 'warning');
  }

  info(title: string, message = '') {
    this.show(title, message, 'info');
  }
}
