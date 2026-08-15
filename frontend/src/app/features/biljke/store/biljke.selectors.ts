import { createSelector } from '@ngrx/store';
import {
  biljkeAdapter,
  selectBiljkeState,
  selectPoslednjaProvera,
  selectSveBiljkeGlobalno,
} from './biljke.reducer';
import { KATEGORIJA_VRSTA_BILJAKA, KategorijaBiljke, StatusBiljke } from '../../../core/models/domain.models';

const { selectAll, selectTotal } = biljkeAdapter.getSelectors(selectBiljkeState);

/** Biljke SKOPOVANE na trenutno učitanu parcelu (BiljkeActions.ucitajBiljke) - "Moje biljke" ekran i modal parcele. */
export const selectSveBiljke = selectAll;
export const selectBrojBiljaka = selectTotal;
export { selectPoslednjaProvera };

/**
 * Zauzeta površina (ove godine zasejanih, još neobranih/nepropalih) biljaka
 * grupisana po kategoriji - koristi dashboard za kružni prikaz. Za razliku
 * od prinosa (koji se popunjava tek nakon berbe preko modula Sadnja), ovo
 * se računa direktno iz biljka.povrsina i vidljivo je odmah po dodavanju
 * nove biljke.
 *
 * VAŽNO: računa se iz `selectSveBiljkeGlobalno` (nezavisna kolekcija puni
 * se preko BiljkeActions.ucitajSveBiljke), a NE iz `selectAll` skopovanog
 * entity adaptera iznad - taj adapter menja svoj sadržaj kad god se otvori
 * neka parcela (skopovan setAll na tu parcelu), pa bi korišćenje istog
 * izvora za dashboard rezultovalo time da se posle posete Parcelama vidi
 * samo poslednje učitana/uneta kultura.
 */
export const selectPovrsinaPoKategoriji = createSelector(selectSveBiljkeGlobalno, (biljke) => {
  const tekucaGodina = new Date().getFullYear();
  const zbirovi: Record<KategorijaBiljke, number> = {
    [KategorijaBiljke.ZITARICE]: 0,
    [KategorijaBiljke.POVRCE]: 0,
    [KategorijaBiljke.VOCE]: 0,
  };

  for (const biljka of biljke) {
    if (biljka.status === StatusBiljke.PROPALA) continue;
    if (new Date(biljka.datumSadnje).getFullYear() !== tekucaGodina) continue;

    const kategorija = KATEGORIJA_VRSTA_BILJAKA[biljka.vrsta];
    zbirovi[kategorija] += biljka.povrsina;
  }

  return zbirovi;
});
