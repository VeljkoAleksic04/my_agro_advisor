import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Parcela } from '../../../core/models/domain.models';
import { ParceleActions } from './parcele.actions';

export interface ParceleState extends EntityState<Parcela> {
  ucitavanje: boolean;
  greska: string | null;
}

export const parceleAdapter = createEntityAdapter<Parcela>({
  selectId: (parcela: Parcela) => parcela.id,
  sortComparer: (a, b) => a.naziv.localeCompare(b.naziv),
});

const pocetnoStanje: ParceleState = parceleAdapter.getInitialState({
  ucitavanje: false,
  greska: null,
});

export const parceleFeature = createFeature({
  name: 'parcele',
  reducer: createReducer(
    pocetnoStanje,
    on(ParceleActions.ucitajParcele, (state): ParceleState => ({
      ...state,
      ucitavanje: true,
      greska: null,
    })),
    on(ParceleActions.ucitajParceleUspesno, (state, { parcele }): ParceleState =>
      parceleAdapter.setAll(parcele, { ...state, ucitavanje: false }),
    ),
    on(ParceleActions.ucitajParceleNeuspesno, (state, { greska }): ParceleState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(ParceleActions.dodajParcelu, (state): ParceleState => ({
      ...state,
      ucitavanje: true,
      greska: null,
    })),
    on(ParceleActions.dodajParceluUspesno, (state, { parcela }): ParceleState =>
      parceleAdapter.addOne(parcela, { ...state, ucitavanje: false }),
    ),
    on(ParceleActions.dodajParceluNeuspesno, (state, { greska }): ParceleState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(ParceleActions.obrisiParcelu, (state): ParceleState => ({
      ...state,
      greska: null,
    })),
    on(ParceleActions.obrisiParceluUspesno, (state, { id }): ParceleState =>
      parceleAdapter.removeOne(id, state),
    ),
    on(ParceleActions.obrisiParceluNeuspesno, (state, { greska }): ParceleState => ({
      ...state,
      greska,
    })),
  ),
});

export const {
  name: parceleFeatureKey,
  reducer: parceleReducer,
  selectParceleState,
  selectUcitavanje,
  selectGreska,
} = parceleFeature;
