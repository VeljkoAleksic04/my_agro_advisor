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
      tap((novi) => {
        const trenutni = this.dogadjaji$.value ?? [];
        this.dogadjaji$.next([...trenutni, novi].sort((a, b) => a.datumPocetka.localeCompare(b.datumPocetka)));
      }),
    );
  }
}
