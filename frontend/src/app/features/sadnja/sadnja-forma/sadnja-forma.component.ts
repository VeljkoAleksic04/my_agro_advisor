import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { BiljkeActions } from '../../biljke/store/biljke.actions';
import { selectSveBiljke } from '../../biljke/store/biljke.selectors';
import { NAZIVI_VRSTA_BILJAKA } from '../../../core/models/domain.models';
import { NovaSadnja } from '../sadnja-api.service';

/**
 * Forma za sejanje (sadnju) biljne kulture na izabranoj parceli.
 * Namerno ne sadrži polja za datum setve/berbe — sejanje se evidentira
 * bez eksplicitnog navođenja tih datuma (mogu se naknadno dodati preko izmene).
 */
@Component({
  selector: 'app-sadnja-forma',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sadnja-forma.component.html',
  styleUrl: './sadnja-forma.component.scss',
})
export class SadnjaFormaComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  @Input({ required: true }) parcelaId!: number;

  @Output() readonly sacuvano = new EventEmitter<NovaSadnja>();
  @Output() readonly otkazano = new EventEmitter<void>();

  protected readonly nazivVrste = NAZIVI_VRSTA_BILJAKA;
  protected readonly biljkeNaParceli = toSignal(this.store.select(selectSveBiljke), { initialValue: [] });

  protected readonly forma = this.fb.nonNullable.group({
    biljkaId: this.fb.control<number | null>(null, [Validators.required]),
    kolicinaPosadjeneKulture: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parcelaId'] && this.parcelaId) {
      this.store.dispatch(BiljkeActions.ucitajBiljke({ parcelaId: this.parcelaId }));
    }
  }

  posalji(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }

    const vrednosti = this.forma.getRawValue();
    this.sacuvano.emit({
      parcelaId: this.parcelaId,
      biljkaId: vrednosti.biljkaId!,
      kolicinaPosadjeneKulture: vrednosti.kolicinaPosadjeneKulture,
    });

    this.forma.reset({ biljkaId: null, kolicinaPosadjeneKulture: 1 });
  }
}
