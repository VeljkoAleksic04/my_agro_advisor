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

  ucitajSveBiljke$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiljkeActions.ucitajSveBiljke),
      switchMap(() =>
        this.api.ucitajSve().pipe(
          map((biljke) => BiljkeActions.ucitajSveBiljkeUspesno({ biljke })),
          catchError((greska) =>
            of(
              BiljkeActions.ucitajSveBiljkeNeuspesno({
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
          catchError((greska) => {
            const telo = greska?.error;
            return of(
              BiljkeActions.dodajBiljkuNeuspesno({
                greska: (telo?.message as string | undefined) ?? 'Greška pri dodavanju biljke',
                kod: telo?.kod as string | undefined,
                slobodnaPovrsina: telo?.slobodnaPovrsina as number | undefined,
              }),
            );
          }),
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

  /**
   * Slanje akcije (oberi, zalij, tretiraj) na backend. Ako backend vrati
   * gresku sa kodom VAN_PERIODA, akcija se ne izvrsava — komponenta dobije
   * `provera` objekat i prikazuje modal sa porukom i dugmetom "Forsiraj".
   */
  izvrsiAkciju$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiljkeActions.izvrsiAkciju),
      switchMap(({ id, payload }) =>
        this.api.izvrsiAkciju(id, payload).pipe(
          map((biljka) => BiljkeActions.izvrsiAkcijuUspesno({ biljka })),
          catchError((greska) => {
            const telo = greska?.error;
            const kod = telo?.kod as string | undefined;
            const poruka = (telo?.message as string | undefined) ?? greska?.error?.message ?? 'Greška pri izvršavanju akcije';
            return of(
              BiljkeActions.izvrsiAkcijuNeuspesno({
                greska: poruka,
                kod,
                provera: telo?.provera,
              }),
            );
          }),
        ),
      ),
    ),
  );

  /**
   * "Suvi" pregled akcije — poziva se pre same akcije da bi komponenta
   * znala unapred da li je u periodu, bez menjanja stanja.
   * (Trenutno nije u upotrebi u komponenti; ostavljeno za buduću optimizaciju.)
   */
  proveriAkciju$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiljkeActions.proveriAkciju),
      switchMap(({ id, akcija }) =>
        this.api.proveriAkciju(id, akcija).pipe(
          map((provera) => BiljkeActions.proveriAkcijuUspesno({ id, akcija, provera })),
          catchError((greska) =>
            of(
              BiljkeActions.proveriAkcijuNeuspesno({
                greska: greska?.error?.message ?? 'Greška pri proveri akcije',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
