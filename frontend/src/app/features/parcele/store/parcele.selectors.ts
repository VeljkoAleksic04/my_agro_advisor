import { createSelector } from '@ngrx/store';
import { parceleAdapter, selectParceleState } from './parcele.reducer';

const { selectAll, selectTotal } = parceleAdapter.getSelectors(selectParceleState);

export const selectSveParcele = selectAll;
export const selectBrojParcela = selectTotal;

export const selectUkupnaPovrsina = createSelector(selectSveParcele, (parcele) =>
  parcele.reduce((zbir, parcela) => zbir + parcela.povrsina, 0),
);
