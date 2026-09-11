import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectKorisnik } from '../../core/auth/store/auth.reducer';
import { ParceleActions } from '../parcele/store/parcele.actions';
import { selectBrojParcela } from '../parcele/store/parcele.selectors';
import { BiljkeActions } from '../biljke/store/biljke.actions';
import { selectPovrsinaPoKategoriji, selectSveBiljke } from '../biljke/store/biljke.selectors';
import { KategorijaBiljke, NAZIVI_KATEGORIJA, NAZIVI_VRSTA_BILJAKA, type Biljka } from '../../core/models/domain.models';
import { KalendarApiService, type KalendarDogadjaj } from '../kalendar/kalendar-api.service';

interface KategorijaPrikaz {
  kategorija: KategorijaBiljke;
  naziv: string;
  vrednost: number;
  prikazVrednosti: string;
  procenat: number;
  boja: string;
}

interface PredvidjeniDogadjaj {
  tip: 'SETVA' | 'BERBA';
  biljka: Biljka;
  pocetak: string;
  kraj: string;
  naziv: string;
}

const ARI_PO_HEKTARU = 100;

function formatirajPovrsinu(vrednostUArima: number): string {
  if (vrednostUArima > ARI_PO_HEKTARU) {
    return `${(vrednostUArima / ARI_PO_HEKTARU).toFixed(2)} ha`;
  }
  return `${vrednostUArima} a`;
}

const BOJE_KATEGORIJA: Record<KategorijaBiljke, string> = {
  [KategorijaBiljke.ZITARICE]: '#d4af37',
  [KategorijaBiljke.VOCE]: '#2e7d32',
  [KategorijaBiljke.POVRCE]: '#c62828',
};

function datumKljuc(godina: number, mesec: number, dan: number): string {
  return `${godina}-${String(mesec).padStart(2, '0')}-${String(dan).padStart(2, '0')}`;
}

function datumIzStringa(iso: string): { mesec: number; dan: number } {
  const [godina, mesec, dan] = iso.slice(0, 10).split('-').map(Number);
  return { mesec, dan };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly kalendarApi = inject(KalendarApiService);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });
  protected readonly brojParcela = toSignal(this.store.select(selectBrojParcela), { initialValue: 0 });
  private readonly povrsinaPoKategoriji = toSignal(this.store.select(selectPovrsinaPoKategoriji), {
    initialValue: { ZITARICE: 0, POVRCE: 0, VOCE: 0 } as Record<KategorijaBiljke, number>,
  });
  protected readonly biljke = toSignal(this.store.select(selectSveBiljke), { initialValue: [] });
  protected readonly kalendarskiDogadjaji = toSignal(this.kalendarApi.ucitajSve(), { initialValue: [] });

  protected readonly nazivVrste = NAZIVI_VRSTA_BILJAKA;
  protected readonly daniUNedelji = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
  protected readonly danas = new Date();
  protected readonly prikazaniMesec = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  protected prikaziFormuDogadjaja = false;
  protected dogadjajZaIzmenu: number | null = null;
  protected slanjeDogadjaja = false;
  protected greskaDogadjaja: string | null = null;

  protected readonly formaDogadjaj = this.fb.group({
    naslov: ['', [Validators.required, Validators.maxLength(120)]],
    datumPocetka: [this.danasnjiDatum(), [Validators.required]],
    datumKraja: [this.danasnjiDatum(), [Validators.required]],
    opis: ['', [Validators.maxLength(500)]],
  });

  protected readonly kategorijePrinosa = computed<KategorijaPrikaz[]>(() => {
    const zbirovi = this.povrsinaPoKategoriji();
    const ukupno = zbirovi.ZITARICE + zbirovi.POVRCE + zbirovi.VOCE;
    return (Object.values(KategorijaBiljke) as KategorijaBiljke[]).map((kategorija) => {
      const vrednost = zbirovi[kategorija];
      return {
        kategorija,
        naziv: NAZIVI_KATEGORIJA[kategorija],
        vrednost,
        prikazVrednosti: formatirajPovrsinu(vrednost),
        procenat: ukupno > 0 ? Math.round((vrednost / ukupno) * 100) : 0,
        boja: BOJE_KATEGORIJA[kategorija],
      };
    });
  });

  protected readonly nazivMeseca = computed(() =>
    this.prikazaniMesec().toLocaleDateString('sr-Latn-RS', { month: 'long', year: 'numeric' }),
  );

  protected readonly danaUMesecu = computed(() => {
    const mesec = this.prikazaniMesec();
    const brojDana = new Date(mesec.getFullYear(), mesec.getMonth() + 1, 0).getDate();
    return Array.from({ length: brojDana }, (_, i) => i + 1);
  });

  protected readonly praznaPolja = computed(() => {
    const mesec = this.prikazaniMesec();
    const prviDan = new Date(mesec.getFullYear(), mesec.getMonth(), 1).getDay();
    const pomeraj = prviDan === 0 ? 6 : prviDan - 1;
    return Array.from({ length: pomeraj });
  });

  protected readonly predvidjeniDogadjaji = computed<PredvidjeniDogadjaj[]>(() => {
    const godina = this.prikazaniMesec().getFullYear();
    return this.biljke().flatMap((biljka) => [
      this.napraviPredvidjeniDogadjaj(biljka, 'SETVA', biljka.pocetakSadnje, biljka.krajSadnje, godina),
      this.napraviPredvidjeniDogadjaj(biljka, 'BERBA', biljka.pocetakBerbe, biljka.krajBerbe, godina),
    ]);
  });

  protected readonly predvidjeniDogadjajiZaMesec = computed(() => {
    const mesec = this.prikazaniMesec();
    const prvi = datumKljuc(mesec.getFullYear(), mesec.getMonth() + 1, 1);
    const poslednji = datumKljuc(mesec.getFullYear(), mesec.getMonth() + 1, this.danaUMesecu().length);
    return this.predvidjeniDogadjaji().filter((d) => d.pocetak <= poslednji && d.kraj >= prvi);
  });

  protected readonly rucniDogadjajiZaMesec = computed(() => {
    const mesec = this.prikazaniMesec();
    const prvi = datumKljuc(mesec.getFullYear(), mesec.getMonth() + 1, 1);
    const poslednji = datumKljuc(mesec.getFullYear(), mesec.getMonth() + 1, this.danaUMesecu().length);
    return this.kalendarskiDogadjaji().filter((d) => {
      const pocetak = d.datumPocetka.slice(0, 10);
      const kraj = d.datumKraja.slice(0, 10);
      return pocetak <= poslednji && kraj >= prvi;
    });
  });

  ngOnInit(): void {
    this.store.dispatch(ParceleActions.ucitajParcele());
    this.store.dispatch(BiljkeActions.ucitajSveBiljke());
  }

  promeniMesec(delta: number): void {
    const trenutni = this.prikazaniMesec();
    this.prikazaniMesec.set(new Date(trenutni.getFullYear(), trenutni.getMonth() + delta, 1));
  }

  idiNaDanas(): void {
    this.prikazaniMesec.set(new Date(this.danas.getFullYear(), this.danas.getMonth(), 1));
  }

  jeDanas(dan: number): boolean {
    const mesec = this.prikazaniMesec();
    return mesec.getFullYear() === this.danas.getFullYear()
      && mesec.getMonth() === this.danas.getMonth()
      && dan === this.danas.getDate();
  }

  datumZaDan(dan: number): string {
    const mesec = this.prikazaniMesec();
    return datumKljuc(mesec.getFullYear(), mesec.getMonth() + 1, dan);
  }

  predvidjeniZaDan(dan: number): PredvidjeniDogadjaj[] {
    const kljuc = this.datumZaDan(dan);
    return this.predvidjeniDogadjaji().filter((d) => d.pocetak <= kljuc && d.kraj >= kljuc);
  }

  rucniZaDan(dan: number): KalendarDogadjaj[] {
    const kljuc = this.datumZaDan(dan);
    return this.kalendarskiDogadjaji().filter((d) => {
      const pocetak = d.datumPocetka.slice(0, 10);
      const kraj = d.datumKraja.slice(0, 10);
      return pocetak <= kljuc && kraj >= kljuc;
    });
  }

  imaSetvu(dan: number): boolean {
    return this.predvidjeniZaDan(dan).some((d) => d.tip === 'SETVA');
  }

  imaBerbu(dan: number): boolean {
    return this.predvidjeniZaDan(dan).some((d) => d.tip === 'BERBA');
  }

  imaRucniDogadjaj(dan: number): boolean {
    return this.rucniZaDan(dan).length > 0;
  }

  naslovDana(dan: number): string {
    const stavke = [
      ...this.predvidjeniZaDan(dan).map((d) => `${d.tip === 'SETVA' ? 'Setva' : 'Žetva/berba'}: ${d.naziv}`),
      ...this.rucniZaDan(dan).map((d) => `Planirano: ${d.naslov}`),
    ];
    return stavke.join('\n');
  }

  otvoriFormuDogadjaja(): void {
    const danas = this.danasnjiDatum();
    this.dogadjajZaIzmenu = null;
    this.formaDogadjaj.reset({ naslov: '', datumPocetka: danas, datumKraja: danas, opis: '' });
    this.greskaDogadjaja = null;
    this.prikaziFormuDogadjaja = true;
  }

  otvoriIzmenuDogadjaja(dogadjaj: KalendarDogadjaj): void {
    this.dogadjajZaIzmenu = dogadjaj.id;
    this.formaDogadjaj.reset({
      naslov: dogadjaj.naslov,
      datumPocetka: dogadjaj.datumPocetka.slice(0, 10),
      datumKraja: dogadjaj.datumKraja.slice(0, 10),
      opis: dogadjaj.opis ?? '',
    });
    this.greskaDogadjaja = null;
    this.prikaziFormuDogadjaja = true;
  }

  obrisiDogadjaj(dogadjaj: KalendarDogadjaj): void {
    if (!window.confirm(`Obrisati događaj „${dogadjaj.naslov}“?`)) return;
    this.greskaDogadjaja = null;
    this.kalendarApi.obrisi(dogadjaj.id).subscribe({
      error: (greska) => {
        this.greskaDogadjaja = greska?.error?.message ?? 'Greška pri brisanju događaja.';
      },
    });
  }

  otkaziFormuDogadjaja(): void {
    this.prikaziFormuDogadjaja = false;
    this.dogadjajZaIzmenu = null;
    this.greskaDogadjaja = null;
  }

  sacuvajDogadjaj(): void {
    if (this.formaDogadjaj.invalid) {
      this.formaDogadjaj.markAllAsTouched();
      return;
    }

    const v = this.formaDogadjaj.getRawValue();
    this.slanjeDogadjaja = true;
    this.greskaDogadjaja = null;

    const zahtev = {
      naslov: v.naslov,
      datumPocetka: v.datumPocetka,
      datumKraja: v.datumKraja,
      opis: v.opis || undefined,
    };

    const operacija = this.dogadjajZaIzmenu === null
      ? this.kalendarApi.kreiraj(zahtev)
      : this.kalendarApi.azuriraj(this.dogadjajZaIzmenu, zahtev);

    operacija.subscribe({
      next: () => {
        this.slanjeDogadjaja = false;
        this.otkaziFormuDogadjaja();
      },
      error: (greska) => {
        this.slanjeDogadjaja = false;
        this.greskaDogadjaja = greska?.error?.message ?? 'Greška pri čuvanju događaja.';
      },
    });
  }

  formatirajPeriod(pocetak: string, kraj: string): string {
    const p = pocetak.slice(0, 10).split('-').reverse().join('.');
    const k = kraj.slice(0, 10).split('-').reverse().join('.');
    return p === k ? p : `${p} – ${k}`;
  }

  obimKruga(poluprecnik: number): number {
    return 2 * Math.PI * poluprecnik;
  }

  private napraviPredvidjeniDogadjaj(
    biljka: Biljka,
    tip: 'SETVA' | 'BERBA',
    pocetakIzBaze: string,
    krajIzBaze: string,
    godinaPrikaza: number,
  ): PredvidjeniDogadjaj {
    const pocetak = datumIzStringa(pocetakIzBaze);
    const kraj = datumIzStringa(krajIzBaze);
    return {
      tip,
      biljka,
      pocetak: datumKljuc(godinaPrikaza, pocetak.mesec, pocetak.dan),
      kraj: datumKljuc(godinaPrikaza, kraj.mesec, kraj.dan),
      naziv: `${this.nazivVrste[biljka.vrsta]} — ${biljka.naziv}`,
    };
  }

  private danasnjiDatum(): string {
    return `${this.danas.getFullYear()}-${String(this.danas.getMonth() + 1).padStart(2, '0')}-${String(this.danas.getDate()).padStart(2, '0')}`;
  }
}
