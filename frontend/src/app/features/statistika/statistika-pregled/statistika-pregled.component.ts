import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { StatistikaApiService } from '../statistika-api.service';
import { ParceleActions } from '../../parcele/store/parcele.actions';
import { selectSveParcele } from '../../parcele/store/parcele.selectors';
import { NAZIVI_VRSTA_BILJAKA, VrstaBiljke, type StatistikaOdgovor } from '../../../core/models/domain.models';

interface TackaZaCrtanje {
  x: number;
  y: number;
  brojTretmana: number;
  prinosT: number;
  parcelaNaziv: string;
}

interface StubZaCrtanje {
  x: number;
  visina: number;
  y: number;
  vrednost: number;
  naziv: string;
  boja: string;
}

const SIRINA_GRAFIKONA = 460;
const VISINA_GRAFIKONA = 220;
const MARGINA = { levo: 40, desno: 12, gore: 12, dole: 28 };

/** Boje stubova u "Poređenje Parcela" grafikonu, ciklicno po redu parcela. */
const BOJE_STUBOVA = ['#2e7d32', '#e58e26', '#4a7fb5', '#c62828', '#8e5fb0'];

@Component({
  selector: 'app-statistika-pregled',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './statistika-pregled.component.html',
  styleUrl: './statistika-pregled.component.scss',
})
export class StatistikaPregledComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly statistikaApi = inject(StatistikaApiService);

  protected readonly nazivVrste = NAZIVI_VRSTA_BILJAKA;
  protected readonly sveVrste = Object.values(VrstaBiljke);
  protected readonly sveParcele = toSignal(this.store.select(selectSveParcele), { initialValue: [] });

  protected readonly ucitavanje = signal(false);
  protected readonly greska = signal<string | null>(null);
  protected readonly podaci = signal<StatistikaOdgovor | null>(null);

  protected readonly filterGodina = signal<number | null>(null);
  protected readonly filterVrsta = signal<VrstaBiljke | null>(null);
  protected readonly filterParcelaId = signal<number | null>(null);

  protected readonly sirinaGrafikona = SIRINA_GRAFIKONA;
  protected readonly visinaGrafikona = VISINA_GRAFIKONA;

  ngOnInit(): void {
    this.store.dispatch(ParceleActions.ucitajParcele());
    this.ucitaj();
  }

  ucitaj(): void {
    this.ucitavanje.set(true);
    this.greska.set(null);
    this.statistikaApi
      .ucitaj({
        godina: this.filterGodina() ?? undefined,
        vrsta: this.filterVrsta() ?? undefined,
        parcelaId: this.filterParcelaId() ?? undefined,
      })
      .subscribe({
        next: (odgovor) => {
          this.podaci.set(odgovor);
          this.ucitavanje.set(false);
        },
        error: () => {
          this.greska.set('Neuspešno učitavanje statistike. Pokušajte ponovo.');
          this.ucitavanje.set(false);
        },
      });
  }

  postaviGodinu(vrednost: string): void {
    this.filterGodina.set(vrednost ? Number(vrednost) : null);
    this.ucitaj();
  }

  postaviVrstu(vrednost: string): void {
    this.filterVrsta.set((vrednost as VrstaBiljke) || null);
    this.ucitaj();
  }

  postaviParcelu(vrednost: string): void {
    this.filterParcelaId.set(vrednost ? Number(vrednost) : null);
    this.ucitaj();
  }

  nazivKultureLabela(): string {
    const vrsta = this.filterVrsta();
    return vrsta ? this.nazivVrste[vrsta] : 'Sve kulture';
  }

  // --- Scatter: Efikasnost Tretmana (Broj Tretmana vs Prinos) ------------

  protected readonly maxBrojTretmana = computed(() => {
    const tacke = this.podaci()?.scatter ?? [];
    return this.lepMax(Math.max(0, ...tacke.map((t) => t.brojTretmana)));
  });

  protected readonly maxPrinosScatter = computed(() => {
    const tacke = this.podaci()?.scatter ?? [];
    return this.lepMax(Math.max(0, ...tacke.map((t) => t.prinosT)));
  });

  protected readonly tackeZaCrtanje = computed<TackaZaCrtanje[]>(() => {
    const tacke = this.podaci()?.scatter ?? [];
    const maxX = this.maxBrojTretmana();
    const maxY = this.maxPrinosScatter();
    return tacke.map((t) => ({
      x: this.skaliraj(t.brojTretmana, 0, maxX, MARGINA.levo, SIRINA_GRAFIKONA - MARGINA.desno),
      y: this.skaliraj(t.prinosT, 0, maxY, VISINA_GRAFIKONA - MARGINA.dole, MARGINA.gore),
      brojTretmana: t.brojTretmana,
      prinosT: t.prinosT,
      parcelaNaziv: t.parcelaNaziv,
    }));
  });

  /** Linija trenda (prosta linearna regresija) preko tacaka scatter grafikona. */
  protected readonly linijaTrenda = computed<string | null>(() => {
    const tacke = this.podaci()?.scatter ?? [];
    if (tacke.length < 2) return null;

    const n = tacke.length;
    const sumaX = tacke.reduce((z, t) => z + t.brojTretmana, 0);
    const sumaY = tacke.reduce((z, t) => z + t.prinosT, 0);
    const sumaXY = tacke.reduce((z, t) => z + t.brojTretmana * t.prinosT, 0);
    const sumaXX = tacke.reduce((z, t) => z + t.brojTretmana * t.brojTretmana, 0);

    const imenilac = n * sumaXX - sumaX * sumaX;
    if (imenilac === 0) return null;

    const nagib = (n * sumaXY - sumaX * sumaY) / imenilac;
    const odsecak = (sumaY - nagib * sumaX) / n;

    const maxX = this.maxBrojTretmana();
    const maxY = this.maxPrinosScatter();
    const y0 = Math.max(0, odsecak);
    const y1 = Math.max(0, odsecak + nagib * maxX);

    const x0px = this.skaliraj(0, 0, maxX, MARGINA.levo, SIRINA_GRAFIKONA - MARGINA.desno);
    const x1px = this.skaliraj(maxX, 0, maxX, MARGINA.levo, SIRINA_GRAFIKONA - MARGINA.desno);
    const y0px = this.skaliraj(y0, 0, maxY, VISINA_GRAFIKONA - MARGINA.dole, MARGINA.gore);
    const y1px = this.skaliraj(y1, 0, maxY, VISINA_GRAFIKONA - MARGINA.dole, MARGINA.gore);

    return `M ${x0px} ${y0px} L ${x1px} ${y1px}`;
  });

  protected readonly osaXOznake = computed(() => this.oznakeOse(this.maxBrojTretmana()));
  protected readonly osaYOznakeScatter = computed(() => this.oznakeOse(this.maxPrinosScatter()));

  // --- Bar: Poređenje Parcela (Prosečan Prinos) ---------------------------

  protected readonly maxPrinosBar = computed(() => {
    const stubovi = this.podaci()?.barPoParceli ?? [];
    return this.lepMax(Math.max(0, ...stubovi.map((s) => s.prosecanPrinosT)));
  });

  protected readonly stuboviZaCrtanje = computed<StubZaCrtanje[]>(() => {
    const stubovi = this.podaci()?.barPoParceli ?? [];
    if (stubovi.length === 0) return [];

    const maxY = this.maxPrinosBar();
    const sirinaDostupna = SIRINA_GRAFIKONA - MARGINA.levo - MARGINA.desno;
    const sirinaStuba = sirinaDostupna / stubovi.length;
    const dnoOse = VISINA_GRAFIKONA - MARGINA.dole;

    return stubovi.map((s, i) => {
      const visinaPx = this.skaliraj(s.prosecanPrinosT, 0, maxY, 0, dnoOse - MARGINA.gore);
      return {
        x: MARGINA.levo + i * sirinaStuba + sirinaStuba * 0.2,
        visina: visinaPx,
        y: dnoOse - visinaPx,
        vrednost: s.prosecanPrinosT,
        naziv: s.parcelaNaziv,
        boja: BOJE_STUBOVA[i % BOJE_STUBOVA.length],
      };
    });
  });

  protected sirinaStuba(): number {
    const broj = this.podaci()?.barPoParceli.length ?? 1;
    const sirinaDostupna = SIRINA_GRAFIKONA - MARGINA.levo - MARGINA.desno;
    return (sirinaDostupna / Math.max(1, broj)) * 0.6;
  }

  protected readonly osaYOznakeBar = computed(() => this.oznakeOse(this.maxPrinosBar()));

  private skaliraj(vrednost: number, uMin: number, uMax: number, izMin: number, izMax: number): number {
    if (uMax === uMin) return izMin;
    return izMin + ((vrednost - uMin) / (uMax - uMin)) * (izMax - izMin);
  }

  /** 4 ravnomerno raspoređene oznake na osi (0..max), zaokružene na "lepu" vrednost. */
  private oznakeOse(max: number): number[] {
    const korak = max / 4;
    return [0, 1, 2, 3, 4].map((i) => Math.round(korak * i * 10) / 10);
  }

  /**
   * Zaokruzuje sirovu maksimalnu vrednost na "lepu" gornju granicu ose
   * (1/2/5/10 * 10^n), tako da Y osa uvek pokriva tacno 0..trenutni-maksimum
   * i sama raste kako vrednosti prinosa rastu (umesto fiksnog opsega).
   */
  private lepMax(sirovaVrednost: number): number {
    if (sirovaVrednost <= 0) return 1;
    const magnituda = 10 ** Math.floor(Math.log10(sirovaVrednost));
    const normalizovano = sirovaVrednost / magnituda;
    let lepaVrednost: number;
    if (normalizovano <= 1) lepaVrednost = 1;
    else if (normalizovano <= 2) lepaVrednost = 2;
    else if (normalizovano <= 5) lepaVrednost = 5;
    else lepaVrednost = 10;
    return lepaVrednost * magnituda;
  }
}
