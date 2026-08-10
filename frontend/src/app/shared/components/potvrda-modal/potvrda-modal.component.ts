import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Generička modalna potvrda koja se koristi umesto browser-ovog confirm()/alert()
 * dijaloga, npr. prilikom brisanja parcele, biljke ili sadnje.
 *
 * Primer korišćenja:
 * <app-potvrda-modal
 *   [otvoren]="obrisatiId !== null"
 *   naslov="Brisanje parcele"
 *   poruka="Da li ste sigurni da želite da obrišete ovu parcelu? Ova akcija je nepovratna."
 *   (potvrdjeno)="potvrdiBrisanje()"
 *   (otkazano)="obrisatiId = null"
 * />
 */
@Component({
  selector: 'app-potvrda-modal',
  standalone: true,
  templateUrl: './potvrda-modal.component.html',
  styleUrl: './potvrda-modal.component.scss',
})
export class PotvrdaModalComponent {
  @Input() otvoren = false;
  @Input() naslov = 'Potvrda brisanja';
  @Input() poruka = 'Da li ste sigurni da želite da obrišete ovu stavku? Ova akcija je nepovratna.';
  @Input() tekstPotvrde = 'Obriši';
  @Input() tekstOtkazivanja = 'Otkaži';

  @Output() readonly potvrdjeno = new EventEmitter<void>();
  @Output() readonly otkazano = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  naEscape(): void {
    if (this.otvoren) {
      this.otkazano.emit();
    }
  }

  potvrdi(): void {
    this.potvrdjeno.emit();
  }

  otkazi(): void {
    this.otkazano.emit();
  }
}
