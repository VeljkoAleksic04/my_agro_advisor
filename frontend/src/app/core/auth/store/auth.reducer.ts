import { createFeature, createReducer, on } from '@ngrx/store';
import { Korisnik } from '../../models/domain.models';
import { AuthActions } from './auth.actions';

export interface AuthState {
  korisnik: Korisnik | null;
  ucitavanje: boolean;
  greska: string | null;
}

const pocetnoStanje: AuthState = {
  korisnik: null,
  ucitavanje: false,
  greska: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    pocetnoStanje,
    on(AuthActions.prijava, AuthActions.registracija, (state): AuthState => ({
      ...state,
      ucitavanje: true,
      greska: null,
    })),
    on(
      AuthActions.prijavaUspesna,
      AuthActions.registracijaUspesna,
      (state, { korisnik }): AuthState => ({
        ...state,
        korisnik,
        ucitavanje: false,
        greska: null,
      }),
    ),
    on(
      AuthActions.prijavaNeuspesna,
      AuthActions.registracijaNeuspesna,
      (state, { greska }): AuthState => ({
        ...state,
        ucitavanje: false,
        greska,
      }),
    ),
    on(AuthActions.ucitajSacuvanuSesiju, (state): AuthState => ({
      ...state,
      ucitavanje: true,
    })),
    on(AuthActions.ucitajSacuvanuSesijuUspesno, (state, { korisnik }): AuthState => ({
      ...state,
      korisnik,
      ucitavanje: false,
      greska: null,
    })),
    on(AuthActions.ucitajSacuvanuSesijuNeuspesno, (state): AuthState => ({
      ...state,
      korisnik: null,
      ucitavanje: false,
    })),
    on(AuthActions.odjava, (): AuthState => pocetnoStanje),
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectKorisnik,
  selectUcitavanje,
  selectGreska,
} = authFeature;
