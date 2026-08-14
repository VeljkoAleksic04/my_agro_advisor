import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Biljka, BiljkaAkcija, ProveraAkcije, VrstaBiljke } from '../../core/models/domain.models';

export type NovaBiljka = {
  naziv: string;
  vrsta: VrstaBiljke;
  povrsina: number;
  parcelaId: number;
  preporucenaTemperaturaC?: number;
  preporucenoDjubrivoId?: number;
};

export interface AkcijaBiljkePayload {
  akcija: BiljkaAkcija;
  forsirajVanPerioda?: boolean;
}

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

  izvrsiAkciju(id: number, payload: AkcijaBiljkePayload): Observable<Biljka> {
    return this.http.post<Biljka>(`${this.baseUrl}/${id}/akcija`, payload);
  }

  proveriAkciju(id: number, akcija: BiljkaAkcija): Observable<ProveraAkcije> {
    return this.http.post<ProveraAkcije>(`${this.baseUrl}/${id}/akcija`, {
      akcija,
      forsirajVanPerioda: true,
    });
  }

  preporukaZaVrstu(vrsta: VrstaBiljke): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/preporuka/${vrsta}`);
  }
}