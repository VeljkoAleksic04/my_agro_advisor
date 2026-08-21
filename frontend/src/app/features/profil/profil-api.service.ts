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
  slika?: string;
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

  promeniLozinku(zahtev: PromeniLozinkuZahtev): Observable<{ poruka: string }> {
    return this.http.patch<{ poruka: string }>(`${this.baseUrl}/lozinka`, zahtev);
  }
}
