import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Korisnik } from '../../models/domain.models';
import { PrijavaPodaci, RegistracijaPodaci } from '../auth-api.service';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Prijava: props<{ podaci: PrijavaPodaci }>(),
    'Prijava Uspesna': props<{ korisnik: Korisnik; token: string }>(),
    'Prijava Neuspesna': props<{ greska: string }>(),

    Registracija: props<{ podaci: RegistracijaPodaci }>(),
    'Registracija Uspesna': props<{ korisnik: Korisnik; token: string }>(),
    'Registracija Neuspesna': props<{ greska: string }>(),

    'Ucitaj Sacuvanu Sesiju': emptyProps(),
    'Ucitaj Sacuvanu Sesiju Uspesno': props<{ korisnik: Korisnik }>(),
    'Ucitaj Sacuvanu Sesiju Neuspesno': emptyProps(),
    Odjava: emptyProps(),
  },
});
