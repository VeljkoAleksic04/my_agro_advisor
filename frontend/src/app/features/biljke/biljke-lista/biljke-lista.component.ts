import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ParceleActions } from '../../parcele/store/parcele.actions';
import { selectSveParcele } from '../../parcele/store/parcele.selectors';
import { BiljkeActions } from '../store/biljke.actions';
import { selectGreska, selectNedovoljnoPovrsineInfo, selectUcitavanje } from '../store/biljke.reducer';
import { selectSveBiljke } from '../store/biljke.selectors';
import { BiljkaFormaComponent, type NovaBiljkaForma } from '../biljka-forma/biljka-forma.component';
import type { NovaBiljka } from '../biljke-api.service';
import { NAZIVI_VRSTA_BILJAKA } from '../../../core/models/domain.models';
import { PotvrdaModalComponent } from '../../../shared/components/potvrda-modal/potvrda-modal.component';

@Component({
  selector: 'app-biljke-lista',
  standalone: true,
  imports: [DatePipe, BiljkaFormaComponent, PotvrdaModalComponent],
  templateUrl: './biljke-lista.component.html',
  styleUrl: './biljke-lista.component.scss',
})
export class BiljkeListaComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly nazivVrste = NAZIVI_VRSTA_BILJAKA;

  protected readonly sveParcele = toSignal(this.store.select(selectSveParcele), { initialValue: [] });
  protected readonly biljke = toSignal(this.store.select(selectSveBiljke), { initialValue: [] });
  protected readonly ucitavanje = toSignal(this.store.select(selectUcitavanje), { initialValue: false });
  protected readonly greska = toSignal(this.store.select(selectGreska), { initialValue: null });
  protected readonly nedovoljnoPovrsineInfo = toSignal(this.store.select(selectNedovoljnoPovrsineInfo), {
    initialValue: null,
  });

  protected odabranaParcelaId: number | null = null;
  protected prikaziFormu = false;
  protected biljkaZaBrisanjeId: number | null = null;

  ngOnInit(): void {
    this.store.dispatch(ParceleActions.ucitajParcele());
  }

  odaberiParcelu(id: string): void {
    this.prikaziFormu = false;
    if (!id) {
      this.odabranaParcelaId = null;
      this.store.dispatch(BiljkeActions.ocistiBiljke());
      return;
    }
    const parcelaId = Number(id);
    this.odabranaParcelaId = parcelaId;
    this.store.dispatch(BiljkeActions.ucitajBiljke({ parcelaId }));
  }

  dodajBiljku(dto: NovaBiljkaForma): void {
    if (!this.odabranaParcelaId) return;
    const noviDto: NovaBiljka = {
      naziv: dto.naziv,
      vrsta: dto.vrsta,
      povrsina: dto.povrsina,
      parcelaId: this.odabranaParcelaId,
    };
    this.store.dispatch(BiljkeActions.dodajBiljku({ dto: noviDto }));
    this.prikaziFormu = false;
  }

  /** Slobodna površina na odabranoj parceli — parametar za formu (checkbox "cela površina" + validacija). */
  get slobodnaPovrsina(): number {
    const parcela = this.sveParcele().find((p) => p.id === this.odabranaParcelaId);
    if (!parcela) return 0;
    const zauzeto = this.biljke().reduce((zbir, b) => zbir + b.povrsina, 0);
    return Math.max(0, Math.floor(parcela.povrsina - zauzeto));
  }

  zatraziBrisanje(id: number): void {
    this.biljkaZaBrisanjeId = id;
  }

  potvrdiBrisanje(): void {
    if (this.biljkaZaBrisanjeId !== null) {
      this.store.dispatch(BiljkeActions.obrisiBiljku({ id: this.biljkaZaBrisanjeId }));
    }
    this.biljkaZaBrisanjeId = null;
  }

  otkaziBrisanje(): void {
    this.biljkaZaBrisanjeId = null;
  }
}
