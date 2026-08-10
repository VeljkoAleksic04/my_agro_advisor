import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ParceleActions } from '../../parcele/store/parcele.actions';
import { selectSveParcele } from '../../parcele/store/parcele.selectors';
import { SadnjaActions } from '../store/sadnja.actions';
import { selectGreska, selectUcitavanje } from '../store/sadnja.reducer';
import { selectSveSadnje } from '../store/sadnja.selectors';
import { SadnjaFormaComponent } from '../sadnja-forma/sadnja-forma.component';
import type { NovaSadnja } from '../sadnja-api.service';
import { NAZIVI_VRSTA_BILJAKA } from '../../../core/models/domain.models';
import { PotvrdaModalComponent } from '../../../shared/components/potvrda-modal/potvrda-modal.component';

@Component({
  selector: 'app-sadnje-lista',
  standalone: true,
  imports: [DatePipe, SadnjaFormaComponent, PotvrdaModalComponent],
  templateUrl: './sadnje-lista.component.html',
  styleUrl: './sadnje-lista.component.scss',
})
export class SadnjeListaComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly nazivVrste = NAZIVI_VRSTA_BILJAKA;

  protected readonly sveParcele = toSignal(this.store.select(selectSveParcele), { initialValue: [] });
  protected readonly sveSadnje = toSignal(this.store.select(selectSveSadnje), { initialValue: [] });
  protected readonly ucitavanje = toSignal(this.store.select(selectUcitavanje), { initialValue: false });
  protected readonly greska = toSignal(this.store.select(selectGreska), { initialValue: null });

  protected odabranaParcelaId: number | null = null;
  protected prikaziFormu = false;
  protected sadnjaZaBrisanjeId: number | null = null;

  ngOnInit(): void {
    this.store.dispatch(ParceleActions.ucitajParcele());
    this.store.dispatch(SadnjaActions.ucitajSadnje());
  }

  odaberiParcelu(id: string): void {
    this.prikaziFormu = false;
    this.odabranaParcelaId = id ? Number(id) : null;
  }

  sadnjeZaOdabranuParcelu() {
    return this.sveSadnje().filter((sadnja) => sadnja.parcelaId === this.odabranaParcelaId);
  }

  zasejKulturu(dto: NovaSadnja): void {
    this.store.dispatch(SadnjaActions.zasejKulturu({ dto }));
    this.prikaziFormu = false;
  }

  zatraziBrisanje(id: number): void {
    this.sadnjaZaBrisanjeId = id;
  }

  potvrdiBrisanje(): void {
    if (this.sadnjaZaBrisanjeId !== null) {
      this.store.dispatch(SadnjaActions.obrisiSadnju({ id: this.sadnjaZaBrisanjeId }));
    }
    this.sadnjaZaBrisanjeId = null;
  }

  otkaziBrisanje(): void {
    this.sadnjaZaBrisanjeId = null;
  }
}
