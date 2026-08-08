import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Biljka } from '../../../core/models/domain.models';
import { BiljkeActions } from './biljke.actions';

export interface BiljkeState extends EntityState<Biljka> {
  ucitavanje: boolean;
  greska: string | null;
  aktivnaParcelaId: number | null;
}

export const biljkeAdapter = createEntityAdapter<Biljka>({
  selectId: (biljka: Biljka) => biljka.id,
  sortComparer: (a, b) => a.naziv.localeCompare(b.naziv),
});

const pocetnoStanje: BiljkeState = biljkeAdapter.getInitialState({
  ucitavanje: false,
  greska: null,
  aktivnaParcelaId: null,
});

export const biljkeFeature = createFeature({
  name: 'biljke',
  reducer: createReducer(
    pocetnoStanje,
    on(BiljkeActions.ucitajBiljke, (state, { parcelaId }): BiljkeState => ({
      ...state,
      ucitavanje: true,
      greska: null,
      aktivnaParcelaId: parcelaId,
    })),
    on(BiljkeActions.ucitajBiljkeUspesno, (state, { biljke }): BiljkeState =>
      biljkeAdapter.setAll(biljke, { ...state, ucitavanje: false }),
    ),
    on(BiljkeActions.ucitajBiljkeNeuspesno, (state, { greska }): BiljkeState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(BiljkeActions.dodajBiljku, (state): BiljkeState => ({
      ...state,
      ucitavanje: true,
      greska: null,
    })),
    on(BiljkeActions.dodajBiljkuUspesno, (state, { biljka }): BiljkeState =>
      biljkeAdapter.addOne(biljka, { ...state, ucitavanje: false }),
    ),
    on(BiljkeActions.dodajBiljkuNeuspesno, (state, { greska }): BiljkeState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(BiljkeActions.obrisiBiljku, (state): BiljkeState => ({
      ...state,
      greska: null,
    })),
    on(BiljkeActions.obrisiBiljkuUspesno, (state, { id }): BiljkeState =>
      biljkeAdapter.removeOne(id, state),
    ),
    on(BiljkeActions.obrisiBiljkuNeuspesno, (state, { greska }): BiljkeState => ({
      ...state,
      greska,
    })),

    on(BiljkeActions.ocistiBiljke, (state): BiljkeState =>
      biljkeAdapter.removeAll({ ...state, aktivnaParcelaId: null }),
    ),
  ),
});

export const {
  name: biljkeFeatureKey,
  reducer: biljkeReducer,
  selectBiljkeState,
  selectUcitavanje,
  selectGreska,
  selectAktivnaParcelaId,
} = biljkeFeature;
