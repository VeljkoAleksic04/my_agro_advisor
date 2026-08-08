import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthApiService } from '../auth-api.service';
import { TokenStorageService } from '../token-storage.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authApi = inject(AuthApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  prijava$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.prijava),
      switchMap(({ podaci }) =>
        this.authApi.prijava(podaci).pipe(
          map((odgovor) =>
            AuthActions.prijavaUspesna({ korisnik: odgovor.korisnik, token: odgovor.access_token }),
          ),
          catchError((greska) =>
            of(AuthActions.prijavaNeuspesna({ greska: greska?.error?.message ?? 'Prijava neuspesna' })),
          ),
        ),
      ),
    ),
  );

  registracija$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registracija),
      switchMap(({ podaci }) =>
        this.authApi.registracija(podaci).pipe(
          map((odgovor) =>
            AuthActions.registracijaUspesna({
              korisnik: odgovor.korisnik,
              token: odgovor.access_token,
            }),
          ),
          catchError((greska) =>
            of(
              AuthActions.registracijaNeuspesna({
                greska: greska?.error?.message ?? 'Registracija neuspesna',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  sacuvajTokenIPreusmeri$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.prijavaUspesna, AuthActions.registracijaUspesna),
        tap(({ token }) => {
          this.tokenStorage.sacuvajToken(token);
          this.router.navigateByUrl('/parcele');
        }),
      ),
    { dispatch: false },
  );

  ucitajSacuvanuSesiju$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.ucitajSacuvanuSesiju),
      switchMap(() => {
        if (!this.tokenStorage.ucitajToken()) {
          return of(AuthActions.ucitajSacuvanuSesijuNeuspesno());
        }
        return this.authApi.mojiPodaci().pipe(
          map((korisnik) => AuthActions.ucitajSacuvanuSesijuUspesno({ korisnik })),
          catchError(() => {
            this.tokenStorage.obrisiToken();
            return of(AuthActions.ucitajSacuvanuSesijuNeuspesno());
          }),
        );
      }),
    ),
  );

  odjava$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.odjava),
        tap(() => {
          this.tokenStorage.obrisiToken();
          this.router.navigateByUrl('/prijava');
        }),
      ),
    { dispatch: false },
  );
}
