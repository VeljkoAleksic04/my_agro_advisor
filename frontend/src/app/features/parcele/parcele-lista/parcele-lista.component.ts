import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, map, merge, startWith } from 'rxjs';
import { ParceleActions } from '../store/parcele.actions';
import { selectGreska, selectUcitavanje } from '../store/parcele.reducer';
import { selectSveParcele, selectUkupnaPovrsina } from '../store/parcele.selectors';
import { ParcelaFormaComponent } from '../parcela-forma/parcela-forma.component';
import { ParcelaDetaljiModalComponent } from '../parcela-detalji-modal/parcela-detalji-modal.component';
import type { NovaParcela } from '../parcele-api.service';
import type { Parcela } from '../../../core/models/domain.models';

@Component({
  selector: 'app-parcele-lista',
  standalone: true,
  imports: [DatePipe, ParcelaFormaComponent, ParcelaDetaljiModalComponent],
  templateUrl: './parcele-lista.component.html',
  styleUrl: './parcele-lista.component.scss',
})
export class ParceleListaComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly ucitavanje = toSignal(this.store.select(selectUcitavanje), { initialValue: false });
  protected readonly greska = toSignal(this.store.select(selectGreska), { initialValue: null });
  protected readonly ukupnaPovrsina = toSignal(this.store.select(selectUkupnaPovrsina), { initialValue: 0 });

  private readonly pojamUnet$ = new Subject<string>();
  private readonly pretragaObrisana$ = new Subject<void>();

  // Demonstracija RxJS kombinacionih operatora: `merge` spaja dva odvojena izvora
  // (unos u polje za pretragu i klik na "Obriši pretragu") u jedan tok stringova,
  // a `combineLatest` taj tok kombinuje sa listom parcela iz store-a kad god se
  // bilo koji od njih promeni.
  protected readonly filtriraneParcele = toSignal(
    combineLatest([
      merge(this.pojamUnet$, this.pretragaObrisana$.pipe(map(() => ''))).pipe(startWith('')),
      this.store.select(selectSveParcele),
    ]).pipe(
      map(([pojam, parcele]: [string, Parcela[]]) =>
        parcele.filter((parcela) => parcela.naziv.toLowerCase().includes(pojam.trim().toLowerCase())),
      ),
    ),
    { initialValue: [] as Parcela[] },
  );

  protected prikaziFormu = false;
  protected parcelaZaModal: Parcela | null = null;

  ngOnInit(): void {
    this.store.dispatch(ParceleActions.ucitajParcele());
  }

  /** Broj kultura zasađenih na parceli — prikazuje se kao bedž na kartici (backend GET /parcele vraca _count.biljke). */
  brojKultura(parcela: Parcela): number {
    return parcela._count?.biljke ?? 0;
  }

  pretraziPo(pojam: string): void {
    this.pojamUnet$.next(pojam);
  }

  obrisiPretragu(unosPretrage: HTMLInputElement): void {
    unosPretrage.value = '';
    this.pretragaObrisana$.next();
  }

  dodajParcelu(dto: NovaParcela): void {
    this.store.dispatch(ParceleActions.dodajParcelu({ dto }));
    this.prikaziFormu = false;
  }

  otvoriDetalje(parcela: Parcela): void {
    this.parcelaZaModal = parcela;
  }

  zatvoriDetalje(): void {
    this.parcelaZaModal = null;
  }

  obrisiParceluIzModala(id: number): void {
    this.store.dispatch(ParceleActions.obrisiParcelu({ id }));
    this.parcelaZaModal = null;
  }
}
