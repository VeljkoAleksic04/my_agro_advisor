export enum UlogaKorisnika {
  GOST = 'GOST',
  FARMER = 'FARMER',
}

export interface Korisnik {
  id: number;
  username: string;
  uloga: UlogaKorisnika;
  ime?: string;
  prezime?: string;
  email?: string;
}

export enum JedinicaPovrsine {
  A = 'A',
  HA = 'HA',
  M2 = 'M2',
}

export interface Parcela {
  id: number;
  vlasnikId: number;
  naziv: string;
  povrsina: number;
  jedinicaMere: JedinicaPovrsine;
  klasa: number;
  datumUpisa: string;
}

export enum SortaPaprike {
  BABURA = 'BABURA',
  SILJA = 'SILJA',
  AJVARKA = 'AJVARKA',
  TURSIJA = 'TURSIJA',
  SOMBORKA = 'SOMBORKA',
}

export interface Biljka {
  id: number;
  naziv: string;
  vrsta: SortaPaprike;
  pocetakSadnje: string;
  krajSadnje: string;
  pocetakBerbe: string;
  krajBerbe: string;
  preporucenaTemperaturaC: number;
  parcelaId: number;
  preporucenoDjubrivoId?: number | null;
}
