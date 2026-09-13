import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatKorisnik {
  id: number;
  username: string;
  ime: string;
  prezime: string;
  slika: string | null;
}

export interface ChatPoruka {
  id: number;
  posiljalacId: number;
  primalacId: number;
  sadrzaj: string;
  datumSlanja: string;
  procitano: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/chat`;

  kontaktiraj(korisnikId: number): Observable<{ uspesno: boolean }> {
    return this.http.post<{ uspesno: boolean }>(`${this.baseUrl}/kontakt/${korisnikId}`, {});
  }

  brojNeprocitanih(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/neprocitane`);
  }

  korisnici(): Observable<ChatKorisnik[]> {
    return this.http.get<ChatKorisnik[]>(`${this.baseUrl}/korisnici`);
  }

  poruke(korisnikId: number): Observable<ChatPoruka[]> {
    return this.http.get<ChatPoruka[]>(`${this.baseUrl}/poruke/${korisnikId}`);
  }

  oznaciProcitano(korisnikId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/procitano/${korisnikId}`, {});
  }
}
