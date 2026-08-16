import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, effect, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { JedinicaPovrsine, TipPreparata, type Biljka, type Parcela } from '../../../core/models/domain.models';
import { BiljkaFormaComponent, type NovaBiljkaForma } from '../../biljke/biljka-forma/biljka-forma.component';
import { BiljkaDetaljiModalComponent } from '../../biljke/biljka-detalji-modal/biljka-detalji-modal.component';
import { PotvrdaModalComponent } from '../../../shared/components/potvrda-modal/potvrda-modal.component';
import { BiljkeActions } from '../../biljke/store/biljke.actions';
import { selectGreska, selectNedovoljnoPovrsineInfo } from '../../biljke/store/biljke.reducer';
import { selectSveBiljke } from '../../biljke/store/biljke.selectors';
import { PreparatApiService } from '../../preparat/preparat-api.service';
import { TretmanApiService } from '../../tretman/tretman-api.service';

/**
 * Modal sa detaljima parcele (opšte informacije + opis + biljke na njoj).
 * Dugme za brisanje i dugme za đubrenje parcele se nalaze isključivo ovde —
 * na kartici u listi ih namerno nema, dostupni su tek nakon otvaranja modala.
 * Biljke se učitavaju preko istog store slice-a kao i "Moje biljke" ekran
 * (BiljkeActions.ucitajBiljke), pa se ovaj modal i biljka-detalji-modal
 * automatski sinhronizuju.
 */
@Component({
  selector: 'app-parcela-detalji-modal',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, BiljkaFormaComponent, BiljkaDetaljiModalComponent, PotvrdaModalComponent],
  templateUrl: './parcela-detalji-modal.component.html',
  styleUrl: './parcela-detalji-modal.component.scss',
})
export class ParcelaDetaljiModalComponent implements OnChanges {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly preparatApi = inject(PreparatApiService);
  private readonly tretmanApi = inject(TretmanApiService);

  @Input() otvoren = false;
  @Input() parcela: Parcela | null = null;

  @Output() readonly zatvoreno = new EventEmitter<void>();
  @Output() readonly obrisano = new EventEmitter<number>();

  protected readonly biljke = toSignal(this.store.select(selectSveBiljke), { initialValue: [] });
  protected readonly greskaBiljke = toSignal(this.store.select(selectGreska), { initialValue: null });
  protected readonly nedovoljnoPovrsineInfo = toSignal(this.store.select(selectNedovoljnoPovrsineInfo), {
    initialValue: null,
  });
  protected readonly preparati = toSignal(this.preparatApi.ucitajSve(), { initialValue: [] });

  protected prikaziFormuBiljke = false;
  protected potvrdaBrisanjaOtvorena = false;
  protected biljkaZaModal: Biljka | null = null;
  protected slanjeDjubriva = false;
  protected greskaDjubriva: string | null = null;

  private prethodniBrojBiljaka = 0;

  constructor() {
    // Forma za dodavanje biljke se zatvara TEK kada broj biljaka u store-u
    // stvarno poraste (tj. kad backend potvrdi kreiranje) - ne odmah po slanju.
    // Ako zahtev padne (greska/409), forma ostaje otvorena i vidi se greska.
    effect(() => {
      const trenutniBroj = this.biljke().length;
      if (this.prikaziFormuBiljke && trenutniBroj > this.prethodniBrojBiljaka) {
        this.prikaziFormuBiljke = false;
      }
      this.prethodniBrojBiljaka = trenutniBroj;
    });

    // Ako se otvorena biljka izbrise iz liste (npr. berba je upravo
    // zavrsila ciklus gajenja pa je biljka uklonjena iz store-a), zatvori
    // njen modal sa detaljima umesto da ostane da prikazuje zastarelo stanje.
    effect(() => {
      const lista = this.biljke();
      if (this.biljkaZaModal && !lista.some((b) => b.id === this.biljkaZaModal!.id)) {
        this.biljkaZaModal = null;
      }
    });
  }

  protected get djubriva() {
    return this.preparati().filter((p) => p.tipPreparata === TipPreparata.DJUBRIVO);
  }

  protected readonly formaDjubrenje = this.fb.group({
    preparatId: [0, [Validators.required, Validators.min(1)]],
    doza: ['', [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parcela'] && this.parcela) {
      this.prikaziFormuBiljke = false;
      this.formaDjubrenje.reset({ preparatId: 0, doza: '' });
      this.greskaDjubriva = null;
      this.store.dispatch(BiljkeActions.ucitajBiljke({ parcelaId: this.parcela.id }));
    }
  }

  get slobodnaPovrsina(): number {
    if (!this.parcela) return 0;
    const zauzeto = this.biljke().reduce((zbir, b) => zbir + b.povrsina, 0);
    return Math.max(0, Math.floor(this.parcela.povrsina - zauzeto));
  }

  get jedinicaPovrsine(): JedinicaPovrsine {
    if(!this.parcela) return JedinicaPovrsine.A;
    return this.parcela.jedinicaMere;
  }

  zatvori(): void {
    this.prikaziFormuBiljke = false;
    this.zatvoreno.emit();
  }

  otvoriBiljku(biljka: Biljka): void {
    this.biljkaZaModal = biljka;
  }

  zatvoriBiljkuModal(): void {
    this.biljkaZaModal = null;
  }

  obrisiBiljkuIzModala(_id: number): void {
    this.biljkaZaModal = null;
  }

  zatraziBrisanje(): void {
    this.potvrdaBrisanjaOtvorena = true;
  }

  potvrdiBrisanje(): void {
    this.potvrdaBrisanjaOtvorena = false;
    if (this.parcela) {
      this.obrisano.emit(this.parcela.id);
    }
  }

  posaljiDjubrenje(): void {
    if (this.formaDjubrenje.invalid || !this.parcela) {
      this.formaDjubrenje.markAllAsTouched();
      return;
    }
    const parcela = this.parcela;
    const v = this.formaDjubrenje.getRawValue();
    this.slanjeDjubriva = true;
    this.greskaDjubriva = null;

    this.tretmanApi.kreiraj({ parcelaId: parcela.id, preparatId: v.preparatId, doza: v.doza }).subscribe({
      next: () => {
        this.slanjeDjubriva = false;
        this.formaDjubrenje.reset({ preparatId: 0, doza: '' });
      },
      error: (greska) => {
        this.slanjeDjubriva = false;
        this.greskaDjubriva = greska?.error?.message ?? 'Greška pri evidentiranju đubrenja';
      },
    });
  }

  dodajBiljku(dto: NovaBiljkaForma): void {
    if (!this.parcela) return;
    this.store.dispatch(
      BiljkeActions.dodajBiljku({
        dto: { naziv: dto.naziv, vrsta: dto.vrsta, povrsina: dto.povrsina, parcelaId: this.parcela.id },
      }),
    );
  }
}