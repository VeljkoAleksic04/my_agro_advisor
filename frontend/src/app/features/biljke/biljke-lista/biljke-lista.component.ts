import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ParceleActions } from '../../parcele/store/parcele.actions';
import { selectSveParcele } from '../../parcele/store/parcele.selectors';
import { BiljkeActions } from '../store/biljke.actions';
import { selectGreska, selectUcitavanje } from '../store/biljke.reducer';
import { selectSveBiljke } from '../store/biljke.selectors';
import { BiljkaFormaComponent } from '../biljka-forma/biljka-forma.component';
import type { NovaBiljka } from '../biljke-api.service';
import { NAZIVI_VRSTA_BILJAKA } from '../../../core/models/domain.models';

@Component({
  selector: 'app-biljke-lista',
  standalone: true,
  imports: [DatePipe, BiljkaFormaComponent],
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

  protected odabranaParcelaId: number | null = null;
  protected prikaziFormu = false;

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

  dodajBiljku(dto: NovaBiljka): void {
    this.store.dispatch(BiljkeActions.dodajBiljku({ dto }));
    this.prikaziFormu = false;
  }

  obrisiBiljku(id: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu biljku?')) {
      this.store.dispatch(BiljkeActions.obrisiBiljku({ id }));
    }
  }
}
