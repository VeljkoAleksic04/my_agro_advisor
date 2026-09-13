import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { interval, startWith, switchMap, Subscription } from 'rxjs';
import { ChatApiService } from '../../features/chat/chat-api.service';

@Injectable({ providedIn: 'root' })
export class ChatNotifikacijaService implements OnDestroy {
  private readonly api = inject(ChatApiService);
  private readonly broj = signal(0);
  private subscription?: Subscription;
  private pokrenuto = false;

  readonly brojNeprocitanih = this.broj.asReadonly();

  pokreni(): void {
    if (this.pokrenuto) return;
    this.pokrenuto = true;
    this.subscription = interval(4000).pipe(startWith(0), switchMap(() => this.api.brojNeprocitanih())).subscribe({
      next: (n) => this.broj.set(n),
    });
  }

  osvezi(): void {
    this.api.brojNeprocitanih().subscribe({ next: (n) => this.broj.set(n) });
  }

  smanji(n = 1): void {
    this.broj.update((v) => Math.max(0, v - n));
  }

  ngOnDestroy(): void { this.subscription?.unsubscribe(); }
}
