import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Biljka } from '../../core/models/domain.models';

export type NovaBiljka = Omit<Biljka, 'id'>;

@Injectable({ providedIn: 'root' })
export class BiljkeApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/biljke`;

  ucitajZaParcelu(parcelaId: number): Observable<Biljka[]> {
    return this.http.get<Biljka[]>(this.baseUrl, { params: { parcelaId } });
  }

  kreiraj(dto: NovaBiljka): Observable<Biljka> {
    return this.http.post<Biljka>(this.baseUrl, dto);
  }

  obrisi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
