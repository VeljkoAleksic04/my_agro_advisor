import {
  biljkeAdapter,
  selectBiljkeState,
  selectPoslednjaProvera,
} from './biljke.reducer';

const { selectAll, selectTotal } = biljkeAdapter.getSelectors(selectBiljkeState);

export const selectSveBiljke = selectAll;
export const selectBrojBiljaka = selectTotal;
export { selectPoslednjaProvera };
