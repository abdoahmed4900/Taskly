import { Subject, takeUntil } from 'rxjs';
import { AuthFacade } from './../auth/facade/auth.facade';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  authFacade = inject(AuthFacade);
  destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.authFacade.getUser().pipe(takeUntil(this.destroy$)).subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
