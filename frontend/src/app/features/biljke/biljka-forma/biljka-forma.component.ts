import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { JedinicaPovrsine, NAZIVI_VRSTA_BILJAKA, VrstaBiljke } from '../../../core/models/domain.models';
import { PotvrdaModalComponent } from '../../../shared/components/potvrda-modal/potvrda-modal.component';
import { jeDatumUPeriodu, preporukaZaVrstu } from '../periodi.util';

export interface NovaBiljkaForma {
  naziv: string;
  vrsta: VrstaBiljke;
  povrsina: number;
}

/**
 * Forma za dodavanje nove biljne kulture na parcelu.
 * Korisnik unosi SAMO naziv, biljnu kulturu (vrstu) i površinu koju kultura
 * zauzima. Periode sadnje/berbe i datum sadnje (danas) računa BACKEND
 * (biljka.service.ts, `izracunajPeriode`) — forma ovde samo prikazuje
 * preporuku iz istog kataloga (`periodi.util`) radi orijentacije korisniku.
 */
@Component({
  selector: 'app-biljka-forma',
  standalone: true,
  imports: [ReactiveFormsModule, PotvrdaModalComponent],
  templateUrl: './biljka-forma.component.html',
  styleUrl: './biljka-forma.component.scss',
})
export class BiljkaFormaComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) parcelaId!: number;
  /** Slobodna (nezauzeta) površina parcele — za validaciju i checkbox "cela površina". */
  @Input() slobodnaPovrsina = 0;
  /** Poruka servera da nema dovoljno slobodne površine (409 NEDOVOLJNO_POVRSINE), ako se desi. */
  @Input() serverskaGreskaPovrsine: { slobodnaPovrsina: number } | null = null;

  @Output() readonly sacuvano = new EventEmitter<NovaBiljkaForma>();
  @Output() readonly otkazano = new EventEmitter<void>();

  
  protected readonly jediniceMerePovrsine = Object.values(JedinicaPovrsine);
  protected readonly vrsteOpcije = Object.values(VrstaBiljke);
  protected readonly nazivVrste = NAZIVI_VRSTA_BILJAKA;
  protected nedovoljnoPovrsineOtvoreno = false;

  protected readonly forma = this.fb.nonNullable.group({
    naziv: ['', [Validators.required, Validators.minLength(2)]],
    vrsta: [VrstaBiljke.PARADAJZ, [Validators.required]],
    celaPovrsina: [false],
    povrsina: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slobodnaPovrsina']) {
      this.primeniCeluPovrsinu(this.forma.controls.celaPovrsina.value);
    }
    if (changes['serverskaGreskaPovrsine'] && this.serverskaGreskaPovrsine) {
      this.nedovoljnoPovrsineOtvoreno = true;
    }
  }

  /** Kada je checkbox čekiran, polje za površinu se sakriva i koristi se cela preostala površina. */
  primeniCeluPovrsinu(celaPovrsina: boolean): void {
    if (celaPovrsina) {
      this.forma.controls.povrsina.setValue(Math.floor(this.slobodnaPovrsina));
      this.forma.controls.povrsina.disable();
    } else {
      this.forma.controls.povrsina.enable();
    }
  }

  get preporukaZaOdabranuVrstu() {
    return preporukaZaVrstu(this.forma.controls.vrsta.value);
  }

  get vanPreporucenogPerioda(): boolean {
    const danasIso = new Date().toISOString().slice(0, 10);
    return !jeDatumUPeriodu(danasIso, this.preporukaZaOdabranuVrstu.setva);
  }

  posalji(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }

    const vrednosti = this.forma.getRawValue();
    const zeljenaPovrsina = vrednosti.celaPovrsina ? Math.floor(this.slobodnaPovrsina) : vrednosti.povrsina;

    if (zeljenaPovrsina <= 0 || zeljenaPovrsina > this.slobodnaPovrsina) {
      this.nedovoljnoPovrsineOtvoreno = true;
      return;
    }

    this.sacuvano.emit({
      naziv: vrednosti.naziv,
      vrsta: vrednosti.vrsta,
      povrsina: Math.round(zeljenaPovrsina),
    });
  }

  zatvoriUpozorenje(): void {
    this.nedovoljnoPovrsineOtvoreno = false;
  }
}
