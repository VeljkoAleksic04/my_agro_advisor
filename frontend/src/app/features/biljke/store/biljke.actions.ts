import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Biljka, BiljkaAkcija, ProveraAkcije, StatusBiljke } from '../../../core/models/domain.models';
import { AkcijaBiljkePayload, NovaBiljka } from '../biljke-api.service';

export const BiljkeActions = createActionGroup({
  source: 'Biljke',
  events: {
    'Ucitaj Biljke': props<{ parcelaId: number }>(),
    'Ucitaj Biljke Uspesno': props<{ biljke: Biljka[] }>(),
    'Ucitaj Biljke Neuspesno': props<{ greska: string }>(),

    /** Sve biljke ulogovanog korisnika sa svih parcela - koristi dashboard profila. */
    'Ucitaj Sve Biljke': emptyProps(),
    'Ucitaj Sve Biljke Uspesno': props<{ biljke: Biljka[] }>(),
    'Ucitaj Sve Biljke Neuspesno': props<{ greska: string }>(),

    'Dodaj Biljku': props<{ dto: NovaBiljka }>(),
    'Dodaj Biljku Uspesno': props<{ biljka: Biljka }>(),
    'Dodaj Biljku Neuspesno': props<{
      greska: string;
      kod?: string;
      slobodnaPovrsina?: number;
    }>(),

    'Obrisi Biljku': props<{ id: number }>(),
    'Obrisi Biljku Uspesno': props<{ id: number }>(),
    'Obrisi Biljku Neuspesno': props<{ greska: string }>(),

    'Izvrsi Akciju': props<{ id: number; payload: AkcijaBiljkePayload }>(),
    'Izvrsi Akciju Uspesno': props<{ biljka: Biljka }>(),
    'Izvrsi Akciju Neuspesno': props<{
      greska: string;
      kod?: string;
      provera?: ProveraAkcije;
    }>(),

    'Proveri Akciju': props<{ id: number; akcija: BiljkaAkcija }>(),
    'Proveri Akciju Uspesno': props<{
      id: number;
      akcija: BiljkaAkcija;
      provera: ProveraAkcije;
    }>(),
    'Proveri Akciju Neuspesno': props<{ greska: string }>(),

    'Azuriraj Status': props<{ id: number; status: StatusBiljke }>(),

    'Ocisti Biljke': emptyProps(),
  },
});
