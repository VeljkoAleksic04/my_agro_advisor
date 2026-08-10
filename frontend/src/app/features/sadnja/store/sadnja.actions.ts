import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Sadnja } from '../../../core/models/domain.models';
import { NovaSadnja } from '../sadnja-api.service';

export const SadnjaActions = createActionGroup({
  source: 'Sadnja',
  events: {
    'Ucitaj Sadnje': emptyProps(),
    'Ucitaj Sadnje Uspesno': props<{ sadnje: Sadnja[] }>(),
    'Ucitaj Sadnje Neuspesno': props<{ greska: string }>(),

    'Zasej Kulturu': props<{ dto: NovaSadnja }>(),
    'Zasej Kulturu Uspesno': props<{ sadnja: Sadnja }>(),
    'Zasej Kulturu Neuspesno': props<{ greska: string }>(),

    'Obrisi Sadnju': props<{ id: number }>(),
    'Obrisi Sadnju Uspesno': props<{ id: number }>(),
    'Obrisi Sadnju Neuspesno': props<{ greska: string }>(),
  },
});
