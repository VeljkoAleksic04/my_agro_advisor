import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProfilApiService } from '../profil-api.service';
import { Korisnik } from '../../../core/models/domain.models';

@Component({
  selector: 'app-profil-nalog',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profil-nalog.component.html',
  styleUrl: './profil-nalog.component.scss',
})
export class ProfilNalogComponent implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly profilApi = inject(ProfilApiService);

  protected readonly ucitavanje = signal(true);
  protected readonly greska = signal<string | null>(null);
  protected readonly korisnik = signal<Korisnik | null>(null);

  protected rezimUredjivanja = false;
  protected slanjeProfila = false;
  protected greskaProfila: string | null = null;
  protected uspehProfila: string | null = null;

  protected rezimLozinke = false;
  protected slanjeLozinke = false;
  protected greskaLozinke: string | null = null;
  protected uspehLozinke: string | null = null;

  protected readonly formaProfil = this.fb.group({
    ime: ['', [Validators.required, Validators.minLength(2)]],
    prezime: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    datumRodjenja: ['', [Validators.required]],
    brojTelefona: [''],
  });

  protected readonly formaLozinka = this.fb.group({
    trenutnaLozinka: ['', [Validators.required]],
    novaLozinka: ['', [Validators.required, Validators.minLength(6)]],
    potvrdaLozinke: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.ucitaj();
  }

  private ucitaj(): void {
    this.ucitavanje.set(true);
    this.greska.set(null);
    this.profilApi.ucitaj().subscribe({
      next: (korisnik) => {
        this.korisnik.set(korisnik);
        this.popuniFormu(korisnik);
        this.ucitavanje.set(false);
      },
      error: () => {
        this.greska.set('Neuspešno učitavanje profila. Pokušajte ponovo.');
        this.ucitavanje.set(false);
      },
    });
  }

  private popuniFormu(korisnik: Korisnik): void {
    this.formaProfil.reset({
      ime: korisnik.ime ?? '',
      prezime: korisnik.prezime ?? '',
      email: korisnik.email ?? '',
      // datetime-local input ocekuje 'YYYY-MM-DD', a backend vraca puni ISO
      // timestamp - odsecamo na prvih 10 karaktera.
      datumRodjenja: korisnik.datumRodjenja ? korisnik.datumRodjenja.slice(0, 10) : '',
      brojTelefona: korisnik.brojTelefona ?? '',
    });
  }

  otvoriUredjivanje(): void {
    const trenutni = this.korisnik();
    if (trenutni) this.popuniFormu(trenutni);
    this.greskaProfila = null;
    this.uspehProfila = null;
    this.rezimUredjivanja = true;
  }

  otkaziUredjivanje(): void {
    this.rezimUredjivanja = false;
  }

  sacuvajProfil(): void {
    if (this.formaProfil.invalid) {
      this.formaProfil.markAllAsTouched();
      return;
    }
    this.slanjeProfila = true;
    this.greskaProfila = null;
    this.uspehProfila = null;

    this.profilApi.azuriraj(this.formaProfil.getRawValue()).subscribe({
      next: (korisnik) => {
        this.korisnik.set(korisnik);
        this.slanjeProfila = false;
        this.rezimUredjivanja = false;
        this.uspehProfila = 'Profil je uspešno ažuriran.';
      },
      error: (greska) => {
        this.slanjeProfila = false;
        this.greskaProfila = greska?.error?.message ?? 'Greška pri ažuriranju profila';
      },
    });
  }

  otvoriPromenuLozinke(): void {
    this.formaLozinka.reset({ trenutnaLozinka: '', novaLozinka: '', potvrdaLozinke: '' });
    this.greskaLozinke = null;
    this.uspehLozinke = null;
    this.rezimLozinke = true;
  }

  otkaziPromenuLozinke(): void {
    this.rezimLozinke = false;
  }

  sacuvajLozinku(): void {
    if (this.formaLozinka.invalid) {
      this.formaLozinka.markAllAsTouched();
      return;
    }
    const v = this.formaLozinka.getRawValue();
    if (v.novaLozinka !== v.potvrdaLozinke) {
      this.greskaLozinke = 'Nova lozinka i potvrda se ne poklapaju';
      return;
    }

    this.slanjeLozinke = true;
    this.greskaLozinke = null;
    this.uspehLozinke = null;

    this.profilApi.promeniLozinku({ trenutnaLozinka: v.trenutnaLozinka, novaLozinka: v.novaLozinka }).subscribe({
      next: () => {
        this.slanjeLozinke = false;
        this.rezimLozinke = false;
        this.uspehLozinke = 'Lozinka je uspešno promenjena.';
      },
      error: (greska) => {
        this.slanjeLozinke = false;
        this.greskaLozinke = greska?.error?.message ?? 'Greška pri promeni lozinke';
      },
    });
  }
}
