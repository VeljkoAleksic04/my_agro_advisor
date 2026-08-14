import { createSelector } from '@ngrx/store';
import {
  biljkeAdapter,
  selectBiljkeState,
  selectPoslednjaProvera,
} from './biljke.reducer';
import { KATEGORIJA_VRSTA_BILJAKA, KategorijaBiljke, StatusBiljke } from '../../../core/models/domain.models';

const { selectAll, selectTotal } = biljkeAdapter.getSelectors(selectBiljkeState);

export const selectSveBiljke = selectAll;
export const selectBrojBiljaka = selectTotal;
export { selectPoslednjaProvera };

/**
 * Zauzeta površina (ove godine zasejanih, još neobranih/nepropalih) biljaka
 * grupisana po kategoriji - koristi dashboard za kružni prikaz. Za razliku
 * od prinosa (koji se popunjava tek nakon berbe preko modula Sadnja), ovo
 * se računa direktno iz biljka.povrsina i vidljivo je odmah po dodavanju
 * nove biljke.
 */
export const selectPovrsinaPoKategoriji = createSelector(selectAll, (biljke) => {
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
