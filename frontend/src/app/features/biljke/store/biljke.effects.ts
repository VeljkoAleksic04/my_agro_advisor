import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { BiljkeActions } from './biljke.actions';
import { BiljkeApiService } from '../biljke-api.service';

@Injectable()
export class BiljkeEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(BiljkeApiService);

  ucitajBiljke$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiljkeActions.ucitajBiljke),
      switchMap(({ parcelaId }) =>
        this.api.ucitajZaParcelu(parcelaId).pipe(
          map((biljke) => BiljkeActions.ucitajBiljkeUspesno({ biljke })),
          catchError((greska) =>
            of(
              BiljkeActions.ucitajBiljkeNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri učitavanju biljaka',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  dodajBiljku$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiljkeActions.dodajBiljku),
      switchMap(({ dto }) =>
        this.api.kreiraj(dto).pipe(
          map((biljka) => BiljkeActions.dodajBiljkuUspesno({ biljka })),
          catchError((greska) =>
            of(
              BiljkeActions.dodajBiljkuNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri dodavanju biljke',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  obrisiBiljku$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiljkeActions.obrisiBiljku),
      switchMap(({ id }) =>
        this.api.obrisi(id).pipe(
          map(() => BiljkeActions.obrisiBiljkuUspesno({ id })),
          catchError((greska) =>
            of(
              BiljkeActions.obrisiBiljkuNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri brisanju biljke',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
