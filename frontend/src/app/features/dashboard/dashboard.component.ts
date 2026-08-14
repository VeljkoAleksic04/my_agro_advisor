import { Component, OnInit, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectKorisnik } from '../../core/auth/store/auth.reducer';
import { ParceleActions } from '../parcele/store/parcele.actions';
import { selectBrojParcela } from '../parcele/store/parcele.selectors';
import { BiljkeActions } from '../biljke/store/biljke.actions';
import { selectPovrsinaPoKategoriji } from '../biljke/store/biljke.selectors';
import { KategorijaBiljke, NAZIVI_KATEGORIJA } from '../../core/models/domain.models';

interface DemoDogadjajSetve {
  dan: number;
  naziv: string;
}

interface KategorijaPrikaz {
  kategorija: KategorijaBiljke;
  naziv: string;
  vrednost: number;
  procenat: number;
  boja: string;
}

const BOJE_KATEGORIJA: Record<KategorijaBiljke, string> = {
  [KategorijaBiljke.ZITARICE]: '#d4af37', // zlatna
  [KategorijaBiljke.VOCE]: '#2e7d32', // zelena
  [KategorijaBiljke.POVRCE]: '#c62828', // crvena
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });
  protected readonly brojParcela = toSignal(this.store.select(selectBrojParcela), { initialValue: 0 });
  private readonly povrsinaPoKategoriji = toSignal(this.store.select(selectPovrsinaPoKategoriji), {
    initialValue: { ZITARICE: 0, POVRCE: 0, VOCE: 0 } as Record<KategorijaBiljke, number>,
  });

  /**
   * Kružni prikazi po kategoriji: procenat = učešće kategorije u ukupnoj
   * zasejanoj površini ove godine. Računa se direktno iz biljaka (ne iz
   * evidentiranog prinosa), pa se nova biljka odmah odražava na dashboard-u.
   */
  protected readonly kategorijePrinosa = computed<KategorijaPrikaz[]>(() => {
    const zbirovi = this.povrsinaPoKategoriji();
    const ukupno = zbirovi.ZITARICE + zbirovi.POVRCE + zbirovi.VOCE;
    return (Object.values(KategorijaBiljke) as KategorijaBiljke[]).map((kategorija) => {
      const vrednost = zbirovi[kategorija];
      return {
        kategorija,
        naziv: NAZIVI_KATEGORIJA[kategorija],
        vrednost,
        procenat: ukupno > 0 ? Math.round((vrednost / ukupno) * 100) : 0,
        boja: BOJE_KATEGORIJA[kategorija],
      };
    });
  });

  // --- Demo kalendar predviđenih vremena setve --------------------------
  // Ovo je samo demo prikaz; stvarni periodi setve po kulturi biće naknadno
  // definisani i povezani sa pravim podacima.
  protected readonly nazivMeseca = new Date().toLocaleDateString('sr-Latn-RS', { month: 'long', year: 'numeric' });
  protected readonly daniUNedelji = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
  protected readonly danasnjiDan = new Date().getDate();

  protected readonly demoDogadjaji: DemoDogadjajSetve[] = [
    { dan: 5, naziv: 'Predviđena setva: Kukuruz' },
    { dan: 12, naziv: 'Predviđena setva: Paprika' },
    { dan: 18, naziv: 'Predviđena setva: Krompir' },
    { dan: 24, naziv: 'Predviđena setva: Pšenica' },
  ];

  protected readonly danaUMesecu: number[] = this.izracunajDaneUMesecu();
  protected readonly praznaPolja: number[] = this.izracunajPraznaPoljaNaPocetku();

  ngOnInit(): void {
    this.store.dispatch(ParceleActions.ucitajParcele());
    this.store.dispatch(BiljkeActions.ucitajSveBiljke());
  }

  dogadjajZaDan(dan: number): DemoDogadjajSetve | undefined {
    return this.demoDogadjaji.find((d) => d.dan === dan);
  }

  /** Obim kružnog prstena (SVG) za dati poluprečnik — koristi se za stroke-dasharray. */
  obimKruga(poluprecnik: number): number {
    return 2 * Math.PI * poluprecnik;
  }

  private izracunajDaneUMesecu(): number[] {
    const sada = new Date();
    const brojDana = new Date(sada.getFullYear(), sada.getMonth() + 1, 0).getDate();
    return Array.from({ length: brojDana }, (_, i) => i + 1);
  }

  private izracunajPraznaPoljaNaPocetku(): number[] {
    const sada = new Date();
    const prviDan = new Date(sada.getFullYear(), sada.getMonth(), 1).getDay(); // 0 = nedelja
    const pomeraj = prviDan === 0 ? 6 : prviDan - 1; // ponedeljak je prvi dan u nedelji
    return Array.from({ length: pomeraj });
  }
}
