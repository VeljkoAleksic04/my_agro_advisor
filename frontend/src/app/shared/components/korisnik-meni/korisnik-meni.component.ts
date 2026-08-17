import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface KorisnikMeniPodaci {
  username: string;
}

/**
 * Padajući meni koji se otvara klikom na ikonu korisnika u zaglavlju.
 * - Ako korisnik NIJE prijavljen: nudi linkove "Prijava" i "Registracija".
 * - Ako JESTE prijavljen: nudi "Pregled profila" i dugme "Odjava".
 * Zatvara se klikom bilo gde van menija (HostListener na document click).
 * Koristi se i na Landing stranici i u Profil zaglavlju, da ikona korisnika
 * svuda ima isto ponašanje.
 */
@Component({
  selector: 'app-korisnik-meni',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './korisnik-meni.component.html',
  styleUrl: './korisnik-meni.component.scss',
})
export class KorisnikMeniComponent {
  private readonly elementRef = inject(ElementRef);

  @Input() korisnik: KorisnikMeniPodaci | null = null;

  @Output() readonly odjava = new EventEmitter<void>();

  protected readonly otvoren = signal(false);

  @HostListener('document:click', ['$event'])
  zatvoriAkoJeVanMenija(dogadjaj: MouseEvent): void {
    if (this.otvoren() && !this.elementRef.nativeElement.contains(dogadjaj.target)) {
      this.otvoren.set(false);
    }
  }

  preklopi(): void {
    this.otvoren.update((v) => !v);
  }

  zatvori(): void {
    this.otvoren.set(false);
  }

  odjaviSe(): void {
    this.zatvori();
    this.odjava.emit();
  }
}
