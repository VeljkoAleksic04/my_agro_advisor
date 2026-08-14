import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Generička modalna komponenta za potvrdu akcije ili prikaz informativne
 * poruke (npr. upozorenje o odstupanju od preporučenog perioda sadnje/berbe).
 *
 * Kada je `samoInformativno` true, prikazuje se samo dugme za potvrdu
 * (nema dugmeta "Otkaži") — koristi se za čisto informativne modale.
 */
@Component({
  selector: 'app-potvrda-modal',
  standalone: true,
  templateUrl: './potvrda-modal.component.html',
  styleUrl: './potvrda-modal.component.scss',
})
export class PotvrdaModalComponent {
  @Input() otvoren = false;
  @Input() naslov = 'Potvrda';
  @Input() poruka = '';
  @Input() tekstPotvrde = 'Potvrdi';
  @Input() tekstOtkazivanja = 'Otkaži';
  @Input() samoInformativno = false;

  @Output() readonly potvrdjeno = new EventEmitter<void>();
  @Output() readonly otkazano = new EventEmitter<void>();

  potvrdi(): void {
    this.potvrdjeno.emit();
  }

  otkazi(): void {
    this.otkazano.emit();
  }
}
