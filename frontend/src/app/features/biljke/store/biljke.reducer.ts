import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Biljka, ProveraAkcije } from '../../../core/models/domain.models';
import { BiljkeActions } from './biljke.actions';

export interface BiljkeState extends EntityState<Biljka> {
  ucitavanje: boolean;
  greska: string | null;
  aktivnaParcelaId: number | null;
  /**
   * Poslednja vracena provera akcije koja je bila van perioda —
   * koristi se da komponenta prikaze modal sa potvrdom.
   */
  poslednjaProvera: ProveraAkcije | null;
  /** Detalji poslednje 409 NEDOVOLJNO_POVRSINE greske - koristi ga forma za informativni modal. */
  nedovoljnoPovrsineInfo: { slobodnaPovrsina: number } | null;
}

export const biljkeAdapter = createEntityAdapter<Biljka>({
  selectId: (biljka: Biljka) => biljka.id,
  sortComparer: (a, b) => a.naziv.localeCompare(b.naziv),
});

const pocetnoStanje: BiljkeState = biljkeAdapter.getInitialState({
  ucitavanje: false,
  greska: null,
  aktivnaParcelaId: null,
  poslednjaProvera: null,
  nedovoljnoPovrsineInfo: null,
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
      poslednjaProvera: null,
    })),
    on(BiljkeActions.ucitajBiljkeUspesno, (state, { biljke }): BiljkeState =>
      biljkeAdapter.setAll(biljke, { ...state, ucitavanje: false }),
    ),
    on(BiljkeActions.ucitajBiljkeNeuspesno, (state, { greska }): BiljkeState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(BiljkeActions.ucitajSveBiljke, (state): BiljkeState => ({
      ...state,
      ucitavanje: true,
      greska: null,
    })),
    on(BiljkeActions.ucitajSveBiljkeUspesno, (state, { biljke }): BiljkeState =>
      biljkeAdapter.setAll(biljke, { ...state, ucitavanje: false, aktivnaParcelaId: null }),
    ),
    on(BiljkeActions.ucitajSveBiljkeNeuspesno, (state, { greska }): BiljkeState => ({
      ...state,
      ucitavanje: false,
      greska,
    })),

    on(BiljkeActions.dodajBiljku, (state): BiljkeState => ({
      ...state,
      ucitavanje: true,
      greska: null,
      nedovoljnoPovrsineInfo: null,
    })),
    on(BiljkeActions.dodajBiljkuUspesno, (state, { biljka }): BiljkeState =>
      biljkeAdapter.addOne(biljka, { ...state, ucitavanje: false }),
    ),
    on(BiljkeActions.dodajBiljkuNeuspesno, (state, { greska, kod, slobodnaPovrsina }): BiljkeState => ({
      ...state,
      ucitavanje: false,
      greska,
      nedovoljnoPovrsineInfo:
        kod === 'NEDOVOLJNO_POVRSINE' && slobodnaPovrsina !== undefined
          ? { slobodnaPovrsina }
          : state.nedovoljnoPovrsineInfo,
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

    on(BiljkeActions.izvrsiAkciju, (state): BiljkeState => ({
      ...state,
      greska: null,
    })),
    on(BiljkeActions.izvrsiAkcijuUspesno, (state, { biljka }): BiljkeState =>
      biljkeAdapter.upsertOne(biljka, {
        ...state,
        poslednjaProvera: null,
      }),
    ),
    on(BiljkeActions.izvrsiAkcijuNeuspesno, (state, { greska, kod, provera }): BiljkeState => ({
      ...state,
      greska,
      poslednjaProvera: kod === 'VAN_PERIODA' && provera ? provera : state.poslednjaProvera,
    })),

    on(BiljkeActions.azurirajStatus, (state, { id, status }): BiljkeState =>
      biljkeAdapter.updateOne({ id, changes: { status } }, state),
    ),

    on(BiljkeActions.ocistiBiljke, (state): BiljkeState =>
      biljkeAdapter.removeAll({
        ...state,
        aktivnaParcelaId: null,
        poslednjaProvera: null,
        nedovoljnoPovrsineInfo: null,
      }),
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
  selectPoslednjaProvera,
  selectNedovoljnoPovrsineInfo,
} = biljkeFeature;
