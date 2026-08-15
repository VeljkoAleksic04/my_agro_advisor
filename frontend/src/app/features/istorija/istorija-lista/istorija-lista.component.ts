import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IstorijaApiService } from '../istorija-api.service';
import { IstorijaParcele, StavkaAktivnosti } from '../../../core/models/domain.models';

/** Kartica po parceli može biti na tabu "Prinos po godinama" ili "Evidencija tretmana". */
type Tab = 'prinos' | 'tretmani';

@Component({
  selector: 'app-istorija-lista',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './istorija-lista.component.html',
  styleUrl: './istorija-lista.component.scss',
})
export class IstorijaListaComponent implements OnInit {
  private readonly istorijaApi = inject(IstorijaApiService);

  protected readonly ucitavanje = signal(false);
  protected readonly greska = signal<string | null>(null);
  protected readonly parcele = signal<IstorijaParcele[]>([]);

  /** Godina izabrana u padajućoj listi - podrazumevano tekuća godina. */
  protected readonly izabranaGodina = signal<number>(new Date().getFullYear());

  /** ID-jevi parcela čije su kartice trenutno otvorene (accordion). */
  private readonly otvorenaParcela = signal<Set<number>>(new Set());
  /** Aktivni tab po parceli. */
  private readonly tabPoParceli = signal<Record<number, Tab>>({});
  /** Red aktivnosti čiji su detalji trenutno prikazani, po parceli. */
  private readonly otvorenaStavka = signal<Record<number, string | null>>({});

  ngOnInit(): void {
    this.ucitaj();
  }

  ucitaj(): void {
    this.ucitavanje.set(true);
    this.greska.set(null);
    this.istorijaApi.ucitaj(this.izabranaGodina()).subscribe({
      next: (parcele) => {
        this.parcele.set(parcele);
        this.ucitavanje.set(false);
        // Prva parcela je podrazumevano otvorena radi lakšeg pregleda.
        if (parcele.length > 0) {
          this.otvorenaParcela.set(new Set([parcele[0].id]));
        }
      },
      error: () => {
        this.greska.set('Neuspešno učitavanje istorije. Pokušajte ponovo.');
        this.ucitavanje.set(false);
      },
    });
  }

  /** Sve godine koje se mogu izabrati - unija godina zabeleženih na svim parcelama. */
  dostupneGodine(): number[] {
    const sve = new Set<number>();
    this.parcele().forEach((p) => p.godineSaZapisima.forEach((g) => sve.add(g)));
    sve.add(new Date().getFullYear());
    return [...sve].sort((a, b) => b - a);
  }

  jeOtvorena(parcelaId: number): boolean {
    return this.otvorenaParcela().has(parcelaId);
  }

  preklopiParcelu(parcelaId: number): void {
    const skup = new Set(this.otvorenaParcela());
    if (skup.has(parcelaId)) {
      skup.delete(parcelaId);
    } else {
      skup.add(parcelaId);
    }
    this.otvorenaParcela.set(skup);
  }

  aktivniTab(parcelaId: number): Tab {
    return this.tabPoParceli()[parcelaId] ?? 'tretmani';
  }

  postaviTab(parcelaId: number, tab: Tab): void {
    this.tabPoParceli.update((mapa) => ({ ...mapa, [parcelaId]: tab }));
  }

  jeStavkaOtvorena(parcelaId: number, stavkaId: string): boolean {
    return this.otvorenaStavka()[parcelaId] === stavkaId;
  }

  prikaziDetalje(parcelaId: number, stavka: StavkaAktivnosti): void {
    this.otvorenaStavka.update((mapa) => ({
      ...mapa,
      [parcelaId]: mapa[parcelaId] === stavka.id ? null : stavka.id,
    }));
  }

  prinosText(parcela: IstorijaParcele): string {
    return `${parcela.prinosUkupno} ${parcela.jedinicaPrinosa.toLowerCase()}`;
  }

  prinosPoHaText(parcela: IstorijaParcele): string {
    return `${parcela.prinosPoHa} ${parcela.jedinicaPrinosa.toLowerCase()}/ha`;
  }
}
