import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CreatePreparatZahtev, Preparat } from '../../core/models/domain.models';

/**
 * Preparati se kesiraju u servisu (BehaviorSubject) umesto da se svaki put
 * ponovo zovu sa backend-a: kad se kroz ovaj servis kreira nov preparat
 * (npr. iz forme "Novi preparat" na parceli/biljci), SVI ekrani koji koriste
 * `ucitajSve()` (preko toSignal-a) ga odmah vide u dropdown listi, bez
 * potrebe za rucnim refetch-om ili event-ima izmedju komponenti.
 */
@Injectable({ providedIn: 'root' })
export class PreparatApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/preparati`;
  private readonly preparatiKes$ = new BehaviorSubject<Preparat[] | null>(null);

  ucitajSve(): Observable<Preparat[]> {
    if (this.preparatiKes$.value === null) {
      this.http.get<Preparat[]>(this.baseUrl).subscribe((lista) => this.preparatiKes$.next(lista));
    }
    return this.preparatiKes$.pipe(filter((lista): lista is Preparat[] => lista !== null));
  }

  kreiraj(zahtev: CreatePreparatZahtev): Observable<Preparat> {
    return this.http.post<Preparat>(this.baseUrl, zahtev).pipe(
      tap((noviPreparat) => {
        const trenutni = this.preparatiKes$.value ?? [];
        this.preparatiKes$.next([...trenutni, noviPreparat]);
      }),
    );
  }
}
