import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Korisnik } from '../models/domain.models';

export interface PrijavaOdgovor {
  access_token: string;
  korisnik: Korisnik;
}

export interface PrijavaPodaci {
  username: string;
  password: string;
}

export interface RegistracijaPodaci {
  ime: string;
  prezime: string;
  email: string;
  datumRodjenja: string;
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  prijava(podaci: PrijavaPodaci): Observable<PrijavaOdgovor> {
    return this.http.post<PrijavaOdgovor>(`${this.baseUrl}/login`, podaci);
  }

  registracija(podaci: RegistracijaPodaci): Observable<PrijavaOdgovor> {
    return this.http.post<PrijavaOdgovor>(`${this.baseUrl}/register`, podaci);
  }

  mojiPodaci(): Observable<Korisnik> {
    return this.http.get<Korisnik>(`${this.baseUrl}/me`);
  }
}
