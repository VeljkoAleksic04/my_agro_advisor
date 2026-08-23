import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Obavestenje {
  id: number;
  korisnikId: number;
  tip: string;
  poruka: string;
  temaId?: number | null;
  porukaId?: number | null;
  procitano: boolean;
  datumKreiranja: string;
}

@Injectable({ providedIn: 'root' })
export class ObavestenjeApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/obavestenja`;

  ucitaj(): Observable<Obavestenje[]> {
    return this.http.get<Obavestenje[]>(this.baseUrl);
  }

  brojNeprocitanih(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/neprocitana`);
  }

  procitaj(id: number): Observable<Obavestenje> {
    return this.http.post<Obavestenje>(`${this.baseUrl}/${id}/procitaj`, {});
  }

  procitajSva(): Observable<{ uspesno: boolean }> {
    return this.http.post<{ uspesno: boolean }>(`${this.baseUrl}/procitaj-sva`, {});
  }
}
