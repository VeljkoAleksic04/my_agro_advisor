import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Korisnik } from '../../core/models/domain.models';

export interface UpdateProfilZahtev {
  ime?: string;
  prezime?: string;
  email?: string;
  datumRodjenja?: string;
  brojTelefona?: string;
  opis?: string;
}

export interface PromeniLozinkuZahtev {
  trenutnaLozinka: string;
  novaLozinka: string;
}

@Injectable({ providedIn: 'root' })
export class ProfilApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profil`;

  ucitaj(): Observable<Korisnik> {
    return this.http.get<Korisnik>(this.baseUrl);
  }

  azuriraj(zahtev: UpdateProfilZahtev): Observable<Korisnik> {
    return this.http.patch<Korisnik>(this.baseUrl, zahtev);
  }

  javniProfil(id: number): Observable<{ id: number; username: string; ime: string; prezime: string; slika: string | null; opis: string | null; ukupnoPoena: number }> {
    return this.http.get<{ id: number; username: string; ime: string; prezime: string; slika: string | null; opis: string | null; ukupnoPoena: number }>(`${this.baseUrl}/korisnik/${id}`);
  }

  azurirajProfilnuSliku(fajl: File): Observable<Korisnik> {
    const podaci = new FormData();
    podaci.append('slika', fajl);
    return this.http.post<Korisnik>(`${this.baseUrl}/slika`, podaci);
  }

  promeniLozinku(zahtev: PromeniLozinkuZahtev): Observable<{ poruka: string }> {
    return this.http.patch<{ poruka: string }>(`${this.baseUrl}/lozinka`, zahtev);
  }
}
