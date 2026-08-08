import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Biljka } from '../../../core/models/domain.models';
import { NovaBiljka } from '../biljke-api.service';

export const BiljkeActions = createActionGroup({
  source: 'Biljke',
  events: {
    'Ucitaj Biljke': props<{ parcelaId: number }>(),
    'Ucitaj Biljke Uspesno': props<{ biljke: Biljka[] }>(),
    'Ucitaj Biljke Neuspesno': props<{ greska: string }>(),

    'Dodaj Biljku': props<{ dto: NovaBiljka }>(),
    'Dodaj Biljku Uspesno': props<{ biljka: Biljka }>(),
    'Dodaj Biljku Neuspesno': props<{ greska: string }>(),

    'Obrisi Biljku': props<{ id: number }>(),
    'Obrisi Biljku Uspesno': props<{ id: number }>(),
    'Obrisi Biljku Neuspesno': props<{ greska: string }>(),

    'Ocisti Biljke': emptyProps(),
  },
});
