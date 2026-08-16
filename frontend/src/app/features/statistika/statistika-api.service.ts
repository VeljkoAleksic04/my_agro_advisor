import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatistikaOdgovor, VrstaBiljke } from '../../core/models/domain.models';

export interface StatistikaFilter {
  godina?: number;
  vrsta?: VrstaBiljke;
  parcelaId?: number;
}

@Injectable({ providedIn: 'root' })
export class StatistikaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/statistika`;

  ucitaj(filter: StatistikaFilter): Observable<StatistikaOdgovor> {
    let params = new HttpParams();
    if (filter.godina) params = params.set('godina', filter.godina);
    if (filter.vrsta) params = params.set('vrsta', filter.vrsta);
    if (filter.parcelaId) params = params.set('parcelaId', filter.parcelaId);
    return this.http.get<StatistikaOdgovor>(this.baseUrl, { params });
  }
}
