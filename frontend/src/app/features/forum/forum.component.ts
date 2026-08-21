import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthActions } from '../../core/auth/store/auth.actions';
import { selectKorisnik } from '../../core/auth/store/auth.reducer';
import { ThemeService } from '../../shared/services/theme.service';
import { KorisnikMeniComponent } from '../../shared/components/korisnik-meni/korisnik-meni.component';
import {
  ForumApiService,
  ForumAutor,
  ForumPoruka,
  ForumTema,
} from './forum-api.service';

interface ForumKomentar extends ForumPoruka {
  nivo: number;
  odgovoriStablo: ForumKomentar[];
}

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [DatePipe, NgTemplateOutlet, RouterLink, ReactiveFormsModule, KorisnikMeniComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss',
})
export class ForumComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly forumApi = inject(ForumApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder).nonNullable;
  protected readonly temaServis = inject(ThemeService);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });
  protected readonly teme = signal<ForumTema[]>([]);
  protected readonly poruke = signal<ForumPoruka[]>([]);
  protected readonly izabranaTema = signal<ForumTema | null>(null);
  protected readonly ucitavanje = signal(true);
  protected readonly greska = signal<string | null>(null);
  protected readonly prikaziFormuTeme = signal(false);
  protected readonly odgovorNa = signal<ForumPoruka | null>(null);
  protected readonly slanjeTeme = signal(false);
  protected readonly slanjePoruke = signal(false);
  protected readonly reagovanjeNaTemu = signal(false);
  protected readonly reagovanjeNaPoruku = signal<number | null>(null);
  protected readonly temaId = signal<number | null>(null);

  protected readonly formaTeme = this.fb.group({
    naslov: ['', [Validators.required, Validators.minLength(3)]],
    opis: ['', [Validators.required, Validators.minLength(3)]],
  });

  protected readonly formaPoruke = this.fb.group({
    sadrzaj: ['', [Validators.required, Validators.minLength(1)]],
  });

  protected readonly komentariStablo = computed<ForumKomentar[]>(() => {
    const svi = this.poruke();
    const mapa = new Map<number, ForumKomentar>();

    for (const poruka of svi) {
      mapa.set(poruka.id, {
        ...poruka,
        nivo: 0,
        odgovoriStablo: [],
      });
    }

    const koreni: ForumKomentar[] = [];

    for (const komentar of mapa.values()) {
      if (komentar.parentId && mapa.has(komentar.parentId)) {
        const roditelj = mapa.get(komentar.parentId)!;
        komentar.nivo = Math.min(roditelj.nivo + 1, 6);
        roditelj.odgovoriStablo.push(komentar);
      } else {
        koreni.push(komentar);
      }
    }

    return koreni;
  });

  ngOnInit(): void {
    this.store.dispatch(AuthActions.ucitajSacuvanuSesiju());

    this.route.paramMap
      .pipe(switchMap((params) => {
        const id = params.get('temaId');
        const broj = id ? Number(id) : null;
        this.temaId.set(Number.isFinite(broj) ? broj : null);
        return this.temaId() ? this.forumApi.ucitajTemu(this.temaId()!) : this.forumApi.ucitajTeme();
      }))
      .subscribe({
        next: (rezultat) => {
          this.greska.set(null);
          this.ucitavanje.set(false);
          if (this.temaId()) {
            const tema = rezultat as ForumTema;
            this.izabranaTema.set(tema);
            this.ucitajPoruke(tema.id);
          } else {
            this.teme.set(rezultat as ForumTema[]);
          }
        },
        error: () => {
          this.ucitavanje.set(false);
          this.greska.set('Neuspešno učitavanje foruma. Pokušajte ponovo.');
        },
      });
  }

  promeniTemu(): void {
    this.temaServis.promeniTemu();
  }

  odjaviSe(): void {
    this.store.dispatch(AuthActions.odjava());
  }

  otvoriTemu(tema: ForumTema): void {
    this.router.navigate(['/forum/tema', tema.id]);
  }

  nazadNaForum(): void {
    this.router.navigate(['/forum']);
  }

  ucitajPoruke(temaId: number): void {
    this.forumApi.ucitajPoruke(temaId).subscribe({
      next: (poruke) => this.poruke.set(poruke),
      error: () => this.greska.set('Neuspešno učitavanje komentara.'),
    });
  }

  otvoriFormuTeme(): void {
    this.formaTeme.reset({ naslov: '', opis: '' });
    this.greska.set(null);
    this.prikaziFormuTeme.set(true);
  }

  zatvoriFormuTeme(): void {
    this.prikaziFormuTeme.set(false);
  }

  kreirajTemu(): void {
    if (this.formaTeme.invalid) {
      this.formaTeme.markAllAsTouched();
      return;
    }

    this.slanjeTeme.set(true);
    this.greska.set(null);

    this.forumApi.kreirajTemu(this.formaTeme.getRawValue()).subscribe({
      next: (tema) => {
        this.slanjeTeme.set(false);
        this.prikaziFormuTeme.set(false);
        this.router.navigate(['/forum/tema', tema.id]);
      },
      error: (greska) => {
        this.slanjeTeme.set(false);
        this.greska.set(greska?.error?.message ?? 'Greška pri kreiranju teme.');
      },
    });
  }

  zapocniOdgovor(poruka: ForumPoruka): void {
    this.odgovorNa.set(poruka);
    this.formaPoruke.reset({ sadrzaj: '' });
    document.getElementById('forum-odgovor')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  otkaziOdgovor(): void {
    this.odgovorNa.set(null);
    this.formaPoruke.reset({ sadrzaj: '' });
  }

  posaljiPoruku(): void {
    const tema = this.izabranaTema();
    if (!tema || this.formaPoruke.invalid) {
      this.formaPoruke.markAllAsTouched();
      return;
    }

    this.slanjePoruke.set(true);
    this.greska.set(null);
    const parentId = this.odgovorNa()?.id;

    this.forumApi.kreirajPoruku({
      temaId: tema.id,
      sadrzaj: this.formaPoruke.getRawValue().sadrzaj,
      ...(parentId ? { parentId } : {}),
    }).subscribe({
      next: () => {
        this.slanjePoruke.set(false);
        this.odgovorNa.set(null);
        this.formaPoruke.reset({ sadrzaj: '' });
        this.ucitajPoruke(tema.id);
      },
      error: (greska) => {
        this.slanjePoruke.set(false);
        this.greska.set(greska?.error?.message ?? 'Greška pri slanju komentara.');
      },
    });
  }

  promeniReakcijuNaTemu(): void {
    const tema = this.izabranaTema();
    if (!tema || this.reagovanjeNaTemu()) return;

    this.reagovanjeNaTemu.set(true);
    this.forumApi.promeniReakcijuNaTemu(tema.id).subscribe({
      next: (rezultat) => {
        this.izabranaTema.update((trenutna) => trenutna ? {
          ...trenutna,
          _count: {
            ...(trenutna._count ?? { poruke: 0 }),
            reakcije: rezultat.brojReakcija,
          },
        } : trenutna);
        this.reagovanjeNaTemu.set(false);
      },
      error: () => this.reagovanjeNaTemu.set(false),
    });
  }

  promeniReakcijuNaPoruku(poruka: ForumPoruka): void {
    if (this.reagovanjeNaPoruku() === poruka.id) return;

    this.reagovanjeNaPoruku.set(poruka.id);
    this.forumApi.promeniReakcijuNaPoruku(poruka.id).subscribe({
      next: (rezultat) => {
        this.poruke.update((sve) => sve.map((stavka) => stavka.id === poruka.id
          ? { ...stavka, _count: { ...(stavka._count ?? { odgovori: 0 }), reakcije: rezultat.brojReakcija } }
          : stavka));
        this.reagovanjeNaPoruku.set(null);
      },
      error: () => this.reagovanjeNaPoruku.set(null),
    });
  }

  obrisiTemu(): void {
    const tema = this.izabranaTema();
    if (!tema || tema.farmerId !== this.korisnik()?.id) return;
    if (!confirm('Da li ste sigurni da želite da obrišete ovu temu?')) return;

    this.forumApi.obrisiTemu(tema.id).subscribe({
      next: () => this.nazadNaForum(),
      error: (greska) => this.greska.set(greska?.error?.message ?? 'Greška pri brisanju teme.'),
    });
  }

  obrisiPoruku(poruka: ForumPoruka): void {
    if (poruka.autorId !== this.korisnik()?.id) return;
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj komentar?')) return;

    this.forumApi.obrisiPoruku(poruka.id).subscribe({
      next: () => {
        const tema = this.izabranaTema();
        if (tema) this.ucitajPoruke(tema.id);
      },
      error: (greska) => this.greska.set(greska?.error?.message ?? 'Greška pri brisanju komentara.'),
    });
  }

  autorIme(autor: ForumAutor): string {
    const punoIme = `${autor.ime ?? ''} ${autor.prezime ?? ''}`.trim();
    return punoIme || autor.username;
  }

  inicijal(autor: ForumAutor): string {
    return (autor.ime?.charAt(0) ?? autor.username.charAt(0) ?? '?').toUpperCase();
  }
}
