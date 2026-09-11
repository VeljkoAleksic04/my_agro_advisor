import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface KalendarDogadjaj {
  id: number;
  farmerId: number;
  naslov: string;
  opis?: string | null;
  datumPocetka: string;
  datumKraja: string;
  kreiranDana: string;
}

export interface NoviKalendarDogadjaj {
  naslov: string;
  opis?: string;
  datumPocetka: string;
  datumKraja?: string;
}

@Injectable({ providedIn: 'root' })
export class KalendarApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/kalendar`;
  private readonly dogadjaji$ = new BehaviorSubject<KalendarDogadjaj[] | null>(null);

  ucitajSve(): Observable<KalendarDogadjaj[]> {
    if (this.dogadjaji$.value === null) {
      this.http.get<KalendarDogadjaj[]>(this.baseUrl).subscribe({
        next: (lista) => this.dogadjaji$.next(lista),
        error: () => this.dogadjaji$.next([]),
      });
    }
    return this.dogadjaji$.pipe(filter((lista): lista is KalendarDogadjaj[] => lista !== null));
  }

  kreiraj(dto: NoviKalendarDogadjaj): Observable<KalendarDogadjaj> {
    return this.http.post<KalendarDogadjaj>(this.baseUrl, dto).pipe(
      tap((novi) => this.postaviSortirano([...(this.dogadjaji$.value ?? []), novi])),
    );
  }

  azuriraj(id: number, dto: Partial<NoviKalendarDogadjaj>): Observable<KalendarDogadjaj> {
    return this.http.patch<KalendarDogadjaj>(`${this.baseUrl}/${id}`, dto).pipe(
      tap((izmenjeni) => {
        const trenutni = (this.dogadjaji$.value ?? []).map((d) => d.id === id ? izmenjeni : d);
        this.postaviSortirano(trenutni);
      }),
    );
  }

  obrisi(id: number): Observable<{ poruka: string }> {
    return this.http.delete<{ poruka: string }>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.dogadjaji$.next((this.dogadjaji$.value ?? []).filter((d) => d.id !== id))),
    );
  }

  private postaviSortirano(lista: KalendarDogadjaj[]): void {
    this.dogadjaji$.next([...lista].sort((a, b) => a.datumPocetka.localeCompare(b.datumPocetka) || a.id - b.id));
  }
}
