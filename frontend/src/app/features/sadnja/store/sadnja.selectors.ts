import { createSelector } from '@ngrx/store';
import { sadnjaAdapter, selectSadnjaState } from './sadnja.reducer';
import { KATEGORIJA_VRSTA_BILJAKA, KategorijaBiljke } from '../../../core/models/domain.models';

const { selectAll, selectTotal } = sadnjaAdapter.getSelectors(selectSadnjaState);

export const selectSveSadnje = selectAll;
export const selectBrojSadnji = selectTotal;

/** Ukupan prinos ove godine, grupisan po kategoriji (žitarice / povrće / voće) — za dashboard kružne prikaze. */
export const selectPrinosPoKategoriji = createSelector(selectSveSadnje, (sadnje) => {
  const tekucaGodina = new Date().getFullYear();
  const zbirovi: Record<KategorijaBiljke, number> = {
    [KategorijaBiljke.ZITARICE]: 0,
    [KategorijaBiljke.POVRCE]: 0,
    [KategorijaBiljke.VOCE]: 0,
  };

  for (const sadnja of sadnje) {
    if (new Date(sadnja.datum).getFullYear() !== tekucaGodina) {
      continue;
    }
    const vrsta = sadnja.biljka?.vrsta;
    if (!vrsta) {
      continue;
    }
    const kategorija = KATEGORIJA_VRSTA_BILJAKA[vrsta];
    zbirovi[kategorija] += sadnja.prinos ?? 0;
  }

  return zbirovi;
});
