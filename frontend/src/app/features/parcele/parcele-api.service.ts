import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Parcela } from '../../core/models/domain.models';

export type NovaParcela = Omit<Parcela, 'id' | 'vlasnikId' | 'datumUpisa'>;

@Injectable({ providedIn: 'root' })
export class ParceleApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/parcele`;

  ucitajSve(): Observable<Parcela[]> {
    return this.http.get<Parcela[]>(this.baseUrl);
  }

  /** GET /parcele/:id - backend ovde ukljucuje i `biljke` i `sadnje` (include). */
  ucitajJednu(id: number): Observable<Parcela> {
    return this.http.get<Parcela>(`${this.baseUrl}/${id}`);
  }

  kreiraj(dto: NovaParcela): Observable<Parcela> {
    return this.http.post<Parcela>(this.baseUrl, dto);
  }

  obrisi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}