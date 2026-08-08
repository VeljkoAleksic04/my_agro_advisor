import { Injectable, effect, signal } from '@angular/core';

export type Tema = 'svetla' | 'tamna';

const KLJUC_TEME = 'agro_tema';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly tema = signal<Tema>(this.ucitajPocetnuTemu());

  constructor() {
    effect(() => {
      const trenutnaTema = this.tema();
      document.documentElement.setAttribute('data-tema', trenutnaTema);
      localStorage.setItem(KLJUC_TEME, trenutnaTema);
    });
  }

  promeniTemu(): void {
    this.tema.update((trenutna) => (trenutna === 'svetla' ? 'tamna' : 'svetla'));
  }

  private ucitajPocetnuTemu(): Tema {
    const sacuvana = localStorage.getItem(KLJUC_TEME);
    if (sacuvana === 'svetla' || sacuvana === 'tamna') {
      return sacuvana;
    }
    const preferiraTamnu = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return preferiraTamnu ? 'tamna' : 'svetla';
  }
}
