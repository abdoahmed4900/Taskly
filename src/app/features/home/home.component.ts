import { Subject, takeUntil, tap } from 'rxjs';
import { AuthFacade } from './../auth/facade/auth.facade';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

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
  router = inject(Router);
  ngOnInit(): void {
    this.authFacade
      .getUser()
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.router.navigateByUrl('/projects');
        }),
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
