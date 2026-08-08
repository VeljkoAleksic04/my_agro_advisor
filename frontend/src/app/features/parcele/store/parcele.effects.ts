import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ParceleActions } from './parcele.actions';
import { ParceleApiService } from '../parcele-api.service';

@Injectable()
export class ParceleEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ParceleApiService);

  ucitajParcele$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParceleActions.ucitajParcele),
      switchMap(() =>
        this.api.ucitajSve().pipe(
          map((parcele) => ParceleActions.ucitajParceleUspesno({ parcele })),
          catchError((greska) =>
            of(
              ParceleActions.ucitajParceleNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri učitavanju parcela',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  dodajParcelu$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParceleActions.dodajParcelu),
      switchMap(({ dto }) =>
        this.api.kreiraj(dto).pipe(
          map((parcela) => ParceleActions.dodajParceluUspesno({ parcela })),
          catchError((greska) =>
            of(
              ParceleActions.dodajParceluNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri dodavanju parcele',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  obrisiParcelu$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParceleActions.obrisiParcelu),
      switchMap(({ id }) =>
        this.api.obrisi(id).pipe(
          map(() => ParceleActions.obrisiParceluUspesno({ id })),
          catchError((greska) =>
            of(
              ParceleActions.obrisiParceluNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri brisanju parcele',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
