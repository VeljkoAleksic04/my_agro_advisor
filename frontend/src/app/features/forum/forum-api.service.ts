import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ForumAutor {
  id: number;
  ime?: string | null;
  prezime?: string | null;
  username: string;
}

export interface ForumTema {
  id: number;
  naslov: string;
  opis: string;
  datumKreiranja: string;
  datumIzmene?: string | null;
  farmerId: number;
  farmer: ForumAutor;
  _count?: { poruke: number; reakcije: number };
}

export interface ForumPoruka {
  id: number;
  sadrzaj: string;
  datumKreiranja: string;
  datumIzmene?: string | null;
  autorId: number;
  autor: ForumAutor;
  temaId: number;
  parentId?: number | null;
  _count?: { reakcije: number; odgovori: number };
}

export interface KreirajTemuZahtev {
  naslov: string;
  opis: string;
}

export interface KreirajPorukuZahtev {
  temaId: number;
  sadrzaj: string;
  parentId?: number;
}

@Injectable({ providedIn: 'root' })
export class ForumApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  ucitajTeme(): Observable<ForumTema[]> {
    return this.http.get<ForumTema[]>(`${this.baseUrl}/teme-foruma`);
  }

  ucitajTemu(id: number): Observable<ForumTema> {
    return this.http.get<ForumTema>(`${this.baseUrl}/teme-foruma/${id}`);
  }

  ucitajPoruke(temaId: number): Observable<ForumPoruka[]> {
    const params = new HttpParams().set('temaId', temaId);
    return this.http.get<ForumPoruka[]>(`${this.baseUrl}/poruke-foruma`, { params });
  }

  kreirajTemu(zahtev: KreirajTemuZahtev): Observable<ForumTema> {
    return this.http.post<ForumTema>(`${this.baseUrl}/teme-foruma`, zahtev);
  }

  kreirajPoruku(zahtev: KreirajPorukuZahtev): Observable<ForumPoruka> {
    return this.http.post<ForumPoruka>(`${this.baseUrl}/poruke-foruma`, zahtev);
  }

  obrisiTemu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/teme-foruma/${id}`);
  }

  obrisiPoruku(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/poruke-foruma/${id}`);
  }

  promeniReakcijuNaTemu(id: number): Observable<{ brojReakcija: number; reagovao: boolean }> {
    return this.http.post<{ brojReakcija: number; reagovao: boolean }>(
      `${this.baseUrl}/teme-foruma/${id}/reakcija`,
      {},
    );
  }

  promeniReakcijuNaPoruku(id: number): Observable<{ brojReakcija: number; reagovao: boolean }> {
    return this.http.post<{ brojReakcija: number; reagovao: boolean }>(
      `${this.baseUrl}/poruke-foruma/${id}/reakcija`,
      {},
    );
  }
}
