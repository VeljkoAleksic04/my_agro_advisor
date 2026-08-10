import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { SadnjaActions } from './sadnja.actions';
import { SadnjaApiService } from '../sadnja-api.service';

@Injectable()
export class SadnjaEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(SadnjaApiService);

  ucitajSadnje$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SadnjaActions.ucitajSadnje),
      switchMap(() =>
        this.api.ucitajSve().pipe(
          map((sadnje) => SadnjaActions.ucitajSadnjeUspesno({ sadnje })),
          catchError((greska) =>
            of(
              SadnjaActions.ucitajSadnjeNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri učitavanju sadnji',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  zasejKulturu$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SadnjaActions.zasejKulturu),
      switchMap(({ dto }) =>
        this.api.kreiraj(dto).pipe(
          map((sadnja) => SadnjaActions.zasejKulturuUspesno({ sadnja })),
          catchError((greska) =>
            of(
              SadnjaActions.zasejKulturuNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri sejanju kulture',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  obrisiSadnju$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SadnjaActions.obrisiSadnju),
      switchMap(({ id }) =>
        this.api.obrisi(id).pipe(
          map(() => SadnjaActions.obrisiSadnjuUspesno({ id })),
          catchError((greska) =>
            of(
              SadnjaActions.obrisiSadnjuNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri brisanju sadnje',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
