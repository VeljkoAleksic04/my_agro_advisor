import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { Obavestenje, ObavestenjeApiService } from '../../services/obavestenje-api.service';

@Component({
  selector: 'app-obavestenja',
  standalone: true,
  templateUrl: './obavestenja.component.html',
  styleUrl: './obavestenja.component.scss',
})
export class ObavestenjaComponent implements OnInit, OnDestroy {
  private readonly api = inject(ObavestenjeApiService);
  private readonly router = inject(Router);
  private subscription?: Subscription;

  protected readonly otvoreno = signal(false);
  protected readonly obavestenja = signal<Obavestenje[]>([]);
  protected readonly brojNeprocitanih = signal(0);

  ngOnInit(): void {
    // Kratak polling omogućava da se nova obaveštenja pojave bez refresh-a
    // stranice, bez uvođenja WebSocket infrastrukture u postojeću aplikaciju.
    this.subscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.api.ucitaj()),
      )
      .subscribe({
        next: (obavestenja) => {
          this.obavestenja.set(obavestenja);
          this.brojNeprocitanih.set(obavestenja.filter((o) => !o.procitano).length);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  toggle(): void {
    this.otvoreno.update((v) => !v);
  }

  procitaj(obavestenje: Obavestenje): void {
    if (!obavestenje.procitano) {
      this.api.procitaj(obavestenje.id).subscribe({
        next: (azurirano) => {
          this.obavestenja.update((lista) =>
            lista.map((o) => o.id === azurirano.id ? azurirano : o),
          );
          this.brojNeprocitanih.update((n) => Math.max(0, n - 1));
          this.otvoriForum(obavestenje);
        },
      });
    } else {
      this.otvoriForum(obavestenje);
    }
  }

  procitajSva(): void {
    if (this.brojNeprocitanih() === 0) return;
    this.api.procitajSva().subscribe({
      next: () => {
        this.obavestenja.update((lista) => lista.map((o) => ({ ...o, procitano: true })));
        this.brojNeprocitanih.set(0);
      },
    });
  }

  private otvoriForum(obavestenje: Obavestenje): void {
    if (obavestenje.temaId) {
      this.router.navigate(['/forum/tema', obavestenje.temaId]);
      this.otvoreno.set(false);
    }
  }

  vreme(datum: string): string {
    return new Date(datum).toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
