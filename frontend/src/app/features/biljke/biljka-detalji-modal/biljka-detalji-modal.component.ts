import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import type { Biljka } from '../../../core/models/domain.models';
import { NAZIVI_VRSTA_BILJAKA, TipPreparata } from '../../../core/models/domain.models';
import { PotvrdaModalComponent } from '../../../shared/components/potvrda-modal/potvrda-modal.component';
import { PreparatApiService } from '../../preparat/preparat-api.service';
import { TretmanApiService } from '../../tretman/tretman-api.service';
import { BiljkeActions } from '../store/biljke.actions';
import { selectPoslednjaProvera } from '../store/biljke.reducer';

type PanelAkcije = 'TRETMAN' | 'NAVODNJAVANJE' | 'BERBA' | null;

/**
 * Modal sa detaljima biljke i akcijama: Tretman, Navodnjavanje, Berba.
 * - Navodnjavanje i Berba pozivaju POST /biljke/:id/akcija (nemaju dodatna
 *   polja u DTO-u na backendu - samo potvrda).
 * - Tretman kreira pravi Tretman zapis (POST /tretmani, preparat + doza) i
 *   zatim označava poslednjiTretman na biljci istim akcija endpoint-om.
 * - Berba poštuje proveru perioda: ako backend vrati 409 VAN_PERIODA, nudi
 *   se "Forsiraj berbu" umesto tihog odbijanja.
 */
@Component({
  selector: 'app-biljka-detalji-modal',
  standalone: true,
  imports: [ReactiveFormsModule, PotvrdaModalComponent, DatePipe],
  templateUrl: './biljka-detalji-modal.component.html',
  styleUrl: './biljka-detalji-modal.component.scss',
})
export class BiljkaDetaljiModalComponent implements OnChanges {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly store = inject(Store);
  private readonly preparatApi = inject(PreparatApiService);
  private readonly tretmanApi = inject(TretmanApiService);

  @Input() otvoren = false;
  @Input() biljka: Biljka | null = null;

  @Output() readonly zatvoreno = new EventEmitter<void>();
  @Output() readonly obrisano = new EventEmitter<number>();

  protected readonly nazivVrste = NAZIVI_VRSTA_BILJAKA;
  protected readonly preparati = toSignal(this.preparatApi.ucitajSve(), { initialValue: [] });
  protected readonly poslednjaProvera = toSignal(this.store.select(selectPoslednjaProvera), {
    initialValue: null,
  });

  protected panel: PanelAkcije = null;
  protected potvrdaBrisanjaOtvorena = false;
  protected slanjeTretmana = false;
  protected greskaTretmana: string | null = null;

  protected get pesticidi() {
    return this.preparati().filter((p) => p.tipPreparata === TipPreparata.PESTICID);
  }

  protected readonly formaTretman = this.fb.group({
    preparatId: [0, [Validators.required, Validators.min(1)]],
    doza: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['biljka']) {
      this.panel = null;
      this.greskaTretmana = null;
      // Ocisti staru "van perioda" proveru kad se otvori DRUGA biljka, da
      // eventualna poruka/dugme "Forsiraj berbu" sa prethodno otvorene
      // biljke ne ostane (i pogresno) vidljivo za novu.
      this.store.dispatch(BiljkeActions.ocistiProveru());
    }
  }

  odaberiPanel(tip: Exclude<PanelAkcije, null>): void {
    this.panel = this.panel === tip ? null : tip;
  }

  potvrdiNavodnjavanje(): void {
    if (!this.biljka) return;
    this.store.dispatch(BiljkeActions.izvrsiAkciju({ id: this.biljka.id, payload: { akcija: 'ZALIJ' } }));
    this.panel = null;
  }

  potvrdiBerbu(forsiraj = false): void {
    if (!this.biljka) return;
    this.store.dispatch(
      BiljkeActions.izvrsiAkciju({
        id: this.biljka.id,
        payload: { akcija: 'OBERI', forsirajVanPerioda: forsiraj },
      }),
    );
    if (forsiraj) this.panel = null;
  }

  /** Da li je poslednja provera (van perioda) vezana za ovu biljku i akciju OBERI. */
  protected get provereBerbaVanPerioda(): boolean {
    const provera = this.poslednjaProvera();
    return !!provera && provera.biljkaId === this.biljka?.id && provera.akcija === 'OBERI';
  }

  posaljiTretman(): void {
    if (this.formaTretman.invalid || !this.biljka) {
      this.formaTretman.markAllAsTouched();
      return;
    }
    const biljka = this.biljka;
    const v = this.formaTretman.getRawValue();
    this.slanjeTretmana = true;
    this.greskaTretmana = null;

    this.tretmanApi
      .kreiraj({ parcelaId: biljka.parcelaId, biljkaId: biljka.id, preparatId: v.preparatId, doza: v.doza })
      .subscribe({
        next: () => {
          this.store.dispatch(BiljkeActions.izvrsiAkciju({ id: biljka.id, payload: { akcija: 'TRETIRAJ' } }));
          this.slanjeTretmana = false;
          this.panel = null;
          this.formaTretman.reset({ preparatId: 0, doza: '' });
        },
        error: (greska) => {
          this.slanjeTretmana = false;
          this.greskaTretmana = greska?.error?.message ?? 'Greška pri evidentiranju tretmana';
        },
      });
  }

  zatvori(): void {
    this.panel = null;
    this.zatvoreno.emit();
  }

  zatraziBrisanje(): void {
    this.potvrdaBrisanjaOtvorena = true;
  }

  potvrdiBrisanje(): void {
    this.potvrdaBrisanjaOtvorena = false;
    if (this.biljka) {
      this.store.dispatch(BiljkeActions.obrisiBiljku({ id: this.biljka.id }));
      this.obrisano.emit(this.biljka.id);
    }
  }
}
