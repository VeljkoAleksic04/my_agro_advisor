import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { SortaPaprike } from '../../../core/models/domain.models';
import { NovaBiljka } from '../biljke-api.service';

@Component({
  selector: 'app-biljka-forma',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './biljka-forma.component.html',
  styleUrl: './biljka-forma.component.scss',
})
export class BiljkaFormaComponent {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) parcelaId!: number;

  @Output() readonly sacuvano = new EventEmitter<NovaBiljka>();
  @Output() readonly otkazano = new EventEmitter<void>();

  protected readonly sorteOpcije = Object.values(SortaPaprike);

  protected readonly forma = this.fb.nonNullable.group({
    naziv: ['', [Validators.required, Validators.minLength(2)]],
    vrsta: [SortaPaprike.BABURA, [Validators.required]],
    pocetakSadnje: ['', [Validators.required]],
    krajSadnje: ['', [Validators.required]],
    pocetakBerbe: ['', [Validators.required]],
    krajBerbe: ['', [Validators.required]],
    preporucenaTemperaturaC: [20, [Validators.required]],
    preporucenoDjubrivoId: this.fb.control<number | null>(null),
  });

  posalji(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }

    const vrednosti = this.forma.getRawValue();
    this.sacuvano.emit({
      naziv: vrednosti.naziv,
      vrsta: vrednosti.vrsta,
      pocetakSadnje: vrednosti.pocetakSadnje,
      krajSadnje: vrednosti.krajSadnje,
      pocetakBerbe: vrednosti.pocetakBerbe,
      krajBerbe: vrednosti.krajBerbe,
      preporucenaTemperaturaC: vrednosti.preporucenaTemperaturaC,
      parcelaId: this.parcelaId,
      preporucenoDjubrivoId: vrednosti.preporucenoDjubrivoId ?? undefined,
    });

    this.forma.reset({
      naziv: '',
      vrsta: SortaPaprike.BABURA,
      pocetakSadnje: '',
      krajSadnje: '',
      pocetakBerbe: '',
      krajBerbe: '',
      preporucenaTemperaturaC: 20,
      preporucenoDjubrivoId: null,
    });
  }
}
