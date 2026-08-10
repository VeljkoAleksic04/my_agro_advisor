import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Sadnja } from '../../../core/models/domain.models';
import { SadnjaActions } from './sadnja.actions';

export interface SadnjaState extends EntityState<Sadnja> {
  ucitavanje: boolean;
  greska: string | null;
}

export const sadnjaAdapter = createEntityAdapter<Sadnja>({
  selectId: (sadnja: Sadnja) => sadnja.id,
  sortComparer: (a, b) => (a.datum < b.datum ? 1 : -1),
});

const pocetnoStanje: SadnjaState = sadnjaAdapter.getInitialState({
  ucitavanje: false,
  greska: null,
});

export const sadnjaFeature = createFeature({
  name: 'sadnja',
  reducer: createReducer(
    pocetnoStanje,
    on(SadnjaActions.ucitajSadnje, (state): SadnjaState => ({
      ...state,
      ucitavanje: true,
      greska: null,
    })),
    on(SadnjaActions.ucitajSadnjeUspesno, (state, { sadnje }): SadnjaState =>
      sadnjaAdapter.setAll(sadnje, { ...state, ucitavanje: false }),
    ),
    on(SadnjaActions.ucitajSadnjeNeuspesno, (state, { greska }): SadnjaState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(SadnjaActions.zasejKulturu, (state): SadnjaState => ({
      ...state,
      ucitavanje: true,
      greska: null,
    })),
    on(SadnjaActions.zasejKulturuUspesno, (state, { sadnja }): SadnjaState =>
      sadnjaAdapter.addOne(sadnja, { ...state, ucitavanje: false }),
    ),
    on(SadnjaActions.zasejKulturuNeuspesno, (state, { greska }): SadnjaState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(SadnjaActions.obrisiSadnju, (state): SadnjaState => ({
      ...state,
      greska: null,
    })),
    on(SadnjaActions.obrisiSadnjuUspesno, (state, { id }): SadnjaState =>
      sadnjaAdapter.removeOne(id, state),
    ),
    on(SadnjaActions.obrisiSadnjuNeuspesno, (state, { greska }): SadnjaState => ({
      ...state,
      greska,
    })),
  ),
});

export const {
  name: sadnjaFeatureKey,
  reducer: sadnjaReducer,
  selectSadnjaState,
  selectUcitavanje,
  selectGreska,
} = sadnjaFeature;
