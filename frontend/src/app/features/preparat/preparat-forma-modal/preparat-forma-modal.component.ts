import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Elementi,
  JedinicaKarence,
  NAZIVI_JEDINICA_KARENCE,
  NAZIVI_TIP_DJUBRIVA,
  NAZIVI_TIP_PESTICIDA,
  Preparat,
  Tezina,
  TipDjubriva,
  TipPesticida,
  TipPreparata,
} from '../../../core/models/domain.models';
import { PreparatApiService } from '../preparat-api.service';

/**
 * Modal za kreiranje sopstvenog preparata (pesticida ili đubriva). Otvara se
 * iz konteksta gde se preparat inače bira (tretman biljke, đubrenje parcele)
 * - `podrazumevaniTip` unapred selektuje odgovarajući tip preparata da
 * korisnik ne mora ručno da ga menja. Nakon uspešnog kreiranja, novi
 * preparat se automatski pojavljuje u svim dropdown listama (videti
 * PreparatApiService - kesira preparate i azurira ih pri kreiranju).
 */
/** Tip jednog reda u FormArray-u sastojaka (element/kolicina/jedinica). */
type SastojakFormGroup = FormGroup<{
  element: import('@angular/forms').FormControl<Elementi>;
  kolicina: import('@angular/forms').FormControl<number>;
  jedinica: import('@angular/forms').FormControl<Tezina>;
}>;

@Component({
  selector: 'app-preparat-forma-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './preparat-forma-modal.component.html',
  styleUrl: './preparat-forma-modal.component.scss',
})
export class PreparatFormaModalComponent implements OnChanges {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly preparatApi = inject(PreparatApiService);

  @Input() otvoren = false;
  @Input() podrazumevaniTip: TipPreparata | null = null;

  @Output() readonly zatvoreno = new EventEmitter<void>();
  @Output() readonly kreiran = new EventEmitter<Preparat>();

  protected readonly TipPreparata = TipPreparata;
  protected readonly nazivTipPesticida = NAZIVI_TIP_PESTICIDA;
  protected readonly nazivTipDjubriva = NAZIVI_TIP_DJUBRIVA;
  protected readonly nazivJedinicaKarence = NAZIVI_JEDINICA_KARENCE;
  protected readonly sveJedinceKarence = Object.values(JedinicaKarence);
  protected readonly sviTipoviPesticida = Object.values(TipPesticida);
  protected readonly sviTipoviDjubriva = Object.values(TipDjubriva);
  protected readonly sviElementi = Object.values(Elementi);
  protected readonly sveTezine = Object.values(Tezina);

  protected slanje = false;
  protected greska: string | null = null;

  protected readonly forma = this.fb.group({
    naziv: ['', [Validators.required, Validators.minLength(2)]],
    proizvodjac: ['', [Validators.required]],
    trajanjeKarence: [0, [Validators.required, Validators.min(0)]],
    jedinicaKarence: [JedinicaKarence.DAN, [Validators.required]],
    tipPreparata: [TipPreparata.PESTICID, [Validators.required]],
    tipPesticida: [null as TipPesticida | null],
    tipDjubriva: [null as TipDjubriva | null],
    opis: ['', [Validators.required]],
    sastojci: this.fb.array<SastojakFormGroup>([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['otvoren'] && this.otvoren) {
      this.resetuj();
    }
  }

  protected get tipPreparata(): TipPreparata {
    return this.forma.controls.tipPreparata.value;
  }

  protected get sastojciNiz(): FormArray<SastojakFormGroup> {
    return this.forma.controls.sastojci;
  }

  private noviRedSastojka(): SastojakFormGroup {
    return this.fb.group({
      element: [Elementi.Mg, [Validators.required]],
      kolicina: [1, [Validators.required, Validators.min(1)]],
      jedinica: [Tezina.G, [Validators.required]],
    });
  }

  dodajSastojak(): void {
    this.sastojciNiz.push(this.noviRedSastojka());
  }

  ukloniSastojak(indeks: number): void {
    this.sastojciNiz.removeAt(indeks);
  }

  private resetuj(): void {
    this.greska = null;
    this.slanje = false;
    this.sastojciNiz.clear();
    this.forma.reset({
      naziv: '',
      proizvodjac: '',
      trajanjeKarence: 0,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: this.podrazumevaniTip ?? TipPreparata.PESTICID,
      tipPesticida: null,
      tipDjubriva: null,
      opis: '',
    });
  }

  posalji(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    const v = this.forma.getRawValue();

    if (v.tipPreparata === TipPreparata.PESTICID && !v.tipPesticida) {
      this.greska = 'Izaberite tip pesticida';
      return;
    }
    if (v.tipPreparata === TipPreparata.DJUBRIVO && !v.tipDjubriva) {
      this.greska = 'Izaberite tip đubriva';
      return;
    }

    this.slanje = true;
    this.greska = null;

    this.preparatApi
      .kreiraj({
        naziv: v.naziv,
        proizvodjac: v.proizvodjac,
        trajanjeKarence: v.trajanjeKarence,
        jedinicaKarence: v.jedinicaKarence,
        tipPreparata: v.tipPreparata,
        tipPesticida: v.tipPreparata === TipPreparata.PESTICID ? v.tipPesticida! : undefined,
        tipDjubriva: v.tipPreparata === TipPreparata.DJUBRIVO ? v.tipDjubriva! : undefined,
        opis: v.opis,
        sastojci: v.sastojci.length > 0 ? v.sastojci : undefined,
      })
      .subscribe({
        next: (noviPreparat) => {
          this.slanje = false;
          this.kreiran.emit(noviPreparat);
          this.zatvori();
        },
        error: (greska) => {
          this.slanje = false;
          this.greska = greska?.error?.message ?? 'Greška pri kreiranju preparata';
        },
      });
  }

  zatvori(): void {
    this.zatvoreno.emit();
  }
}
