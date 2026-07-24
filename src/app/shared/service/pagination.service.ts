import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  currentPages = signal<number[]>([]);
  currentPage = signal<number>(1);
  itemsPerPage = signal(2);
  allPages = signal<number[]>([]);
  initializePagination(totalItems: number) {
    for (let index = 1; index <= Math.ceil(totalItems / this.itemsPerPage()); index++) {
      this.allPages()!.push(index);
    }
    this.currentPages.set(this.allPages().slice(0, 2));
  }
  previousPage() {
    if (this.currentPage() == 1) {
      return;
    }
    this.currentPage.update(v => v - 1);
    if (this.currentPage()! % this.itemsPerPage() == 0) {
      this.currentPages.set([this.currentPage()! - 1, this.currentPage()!]);
    }
  }
  goToPage(index: number) {
    this.currentPage.set(index);
  }
  nextPage() {
    if (this.currentPage()! >= this.allPages()!.length) {
      return;
    }

    this.currentPage.update(v => v! + 1);

    if (this.currentPage() % this.itemsPerPage() == 1) {
      this.currentPages.set(
        this.currentPage() == this.allPages()![this.allPages()!.length - 1]
          ? [this.currentPage()!]
          : [this.currentPage()!, this.currentPage()! + 1],
      );
    }
  }
}
