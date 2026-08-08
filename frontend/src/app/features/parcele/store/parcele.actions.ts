import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Parcela } from '../../../core/models/domain.models';
import { NovaParcela } from '../parcele-api.service';

export const ParceleActions = createActionGroup({
  source: 'Parcele',
  events: {
    'Ucitaj Parcele': emptyProps(),
    'Ucitaj Parcele Uspesno': props<{ parcele: Parcela[] }>(),
    'Ucitaj Parcele Neuspesno': props<{ greska: string }>(),

    'Dodaj Parcelu': props<{ dto: NovaParcela }>(),
    'Dodaj Parcelu Uspesno': props<{ parcela: Parcela }>(),
    'Dodaj Parcelu Neuspesno': props<{ greska: string }>(),

    'Obrisi Parcelu': props<{ id: number }>(),
    'Obrisi Parcelu Uspesno': props<{ id: number }>(),
    'Obrisi Parcelu Neuspesno': props<{ greska: string }>(),
  },
});
