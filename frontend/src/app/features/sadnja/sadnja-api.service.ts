import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sadnja } from '../../core/models/domain.models';

// Sejanje se radi bez eksplicitnog navodjenja datuma setve/berbe — backend
// polje ocekivaniDatumBerbe je opciono i ovde se namerno ne salje.
export interface NovaSadnja {
  parcelaId: number;
  biljkaId: number;
  kolicinaPosadjeneKulture: number;
}

@Injectable({ providedIn: 'root' })
export class SadnjaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sadnje`;

  ucitajSve(): Observable<Sadnja[]> {
    return this.http.get<Sadnja[]>(this.baseUrl);
  }

  kreiraj(dto: NovaSadnja): Observable<Sadnja> {
    return this.http.post<Sadnja>(this.baseUrl, dto);
  }

  obrisi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
