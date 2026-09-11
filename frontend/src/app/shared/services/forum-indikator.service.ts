import { Injectable, inject, signal } from '@angular/core';
import { interval, startWith, switchMap } from 'rxjs';
import { ForumApiService } from '../../features/forum/forum-api.service';

const KLJUC_POSLEDNJE_VIDJENE_TEME = 'agro_forum_poslednje_vidjeno';

/** Prati da li je nakon poslednje posete forumu objavljena nova tema. */
@Injectable({ providedIn: 'root' })
export class ForumIndikatorService {
  private readonly forumApi = inject(ForumApiService);
  private pokrenut = false;

  readonly imaNovihTema = signal(false);

  pokreni(): void {
    if (this.pokrenut) return;
    this.pokrenut = true;
    interval(15_000)
      .pipe(startWith(0), switchMap(() => this.forumApi.ucitajTeme()))
      .subscribe({
        next: (teme) => this.azuriraj(teme[0]?.datumKreiranja ?? null),
      });
  }

  oznaciKaoVidjeno(): void {
    this.forumApi.ucitajTeme().subscribe({
      next: (teme) => {
        const poslednjaTema = teme[0]?.datumKreiranja;
        if (poslednjaTema) localStorage.setItem(KLJUC_POSLEDNJE_VIDJENE_TEME, poslednjaTema);
        this.imaNovihTema.set(false);
      },
    });
  }

  private azuriraj(poslednjaTema: string | null): void {
    if (!poslednjaTema) return;
    const poslednjeVidjeno = localStorage.getItem(KLJUC_POSLEDNJE_VIDJENE_TEME);
    // Pri prvom učitavanju ne označavamo sve postojeće teme kao nove.
    if (!poslednjeVidjeno) {
      localStorage.setItem(KLJUC_POSLEDNJE_VIDJENE_TEME, poslednjaTema);
      return;
    }
    this.imaNovihTema.set(new Date(poslednjaTema).getTime() > new Date(poslednjeVidjeno).getTime());
  }
}
