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
  datumRodjenja?: string;
  brojTelefona?: string | null;
  slika?: string | null;
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
  /** Kratak opis parcele — prikazuje se u modalu sa detaljima. */
  opis?: string;
  /** Broj biljaka na parceli - vraca ga GET /parcele (findAllZaKorisnika, include _count). */
  _count?: { biljke: number };
}

export enum VrstaBiljke {
  PSENICA = 'PSENICA',
  KUKURUZ = 'KUKURUZ',
  JECAM = 'JECAM',
  OVAS = 'OVAS',
  RAZ = 'RAZ',
  SUNCOKRET = 'SUNCOKRET',
  SOJA = 'SOJA',
  SECERNA_REPA = 'SECERNA_REPA',
  KROMPIR = 'KROMPIR',
  PARADAJZ = 'PARADAJZ',
  PAPRIKA = 'PAPRIKA',
  KRASTAVAC = 'KRASTAVAC',
  KUPUS = 'KUPUS',
  LUK = 'LUK',
  BELI_LUK = 'BELI_LUK',
  SARGAREPA = 'SARGAREPA',
  SALATA = 'SALATA',
  TIKVICA = 'TIKVICA',
  LUBENICA = 'LUBENICA',
  DINJA = 'DINJA',
}

/** Čitljivi (prikazni) nazivi za VrstaBiljke enum, za korišćenje u UI-ju. */
export const NAZIVI_VRSTA_BILJAKA: Record<VrstaBiljke, string> = {
  [VrstaBiljke.PSENICA]: 'Pšenica',
  [VrstaBiljke.KUKURUZ]: 'Kukuruz',
  [VrstaBiljke.JECAM]: 'Ječam',
  [VrstaBiljke.OVAS]: 'Ovas',
  [VrstaBiljke.RAZ]: 'Raž',
  [VrstaBiljke.SUNCOKRET]: 'Suncokret',
  [VrstaBiljke.SOJA]: 'Soja',
  [VrstaBiljke.SECERNA_REPA]: 'Šećerna repa',
  [VrstaBiljke.KROMPIR]: 'Krompir',
  [VrstaBiljke.PARADAJZ]: 'Paradajz',
  [VrstaBiljke.PAPRIKA]: 'Paprika',
  [VrstaBiljke.KRASTAVAC]: 'Krastavac',
  [VrstaBiljke.KUPUS]: 'Kupus',
  [VrstaBiljke.LUK]: 'Luk',
  [VrstaBiljke.BELI_LUK]: 'Beli luk',
  [VrstaBiljke.SARGAREPA]: 'Sargarepa',
  [VrstaBiljke.SALATA]: 'Salata',
  [VrstaBiljke.TIKVICA]: 'Tikvica',
  [VrstaBiljke.LUBENICA]: 'Lubenica',
  [VrstaBiljke.DINJA]: 'Dinja',
};

export interface Biljka {
  id: number;
  naziv: string;
  vrsta: VrstaBiljke;
  pocetakSadnje: string;
  krajSadnje: string;
  pocetakBerbe: string;
  krajBerbe: string;
  preporucenaTemperaturaC: number;
  parcelaId: number;
  preporucenoDjubrivoId?: number | null;
  status: StatusBiljke;
  poslednjeZalivanje?: string | null;
  poslednjiTretman?: string | null;
  poslednjaBerba?: string | null;
  /** Površina na parceli zauzeta ovom kulturom. */
  povrsina: number;
  /** Datum stvarne sadnje (dodavanja biljke na parcelu). */
  datumSadnje: string;
}

/** Kategorija kojoj vrsta biljke pripada — koristi se za dashboard prikaz prinosa. */
export enum KategorijaBiljke {
  ZITARICE = 'ZITARICE',
  POVRCE = 'POVRCE',
  VOCE = 'VOCE',
}

export const NAZIVI_KATEGORIJA: Record<KategorijaBiljke, string> = {
  [KategorijaBiljke.ZITARICE]: 'Žitarice',
  [KategorijaBiljke.POVRCE]: 'Povrće',
  [KategorijaBiljke.VOCE]: 'Voće',
};

/** Mapiranje svake vrste biljke u jednu od tri dashboard kategorije prinosa. */
export const KATEGORIJA_VRSTA_BILJAKA: Record<VrstaBiljke, KategorijaBiljke> = {
  [VrstaBiljke.PSENICA]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.KUKURUZ]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.JECAM]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.OVAS]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.RAZ]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.SUNCOKRET]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.SOJA]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.SECERNA_REPA]: KategorijaBiljke.ZITARICE,
  [VrstaBiljke.KROMPIR]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.PARADAJZ]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.PAPRIKA]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.KRASTAVAC]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.KUPUS]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.LUK]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.BELI_LUK]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.SARGAREPA]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.SALATA]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.TIKVICA]: KategorijaBiljke.POVRCE,
  [VrstaBiljke.LUBENICA]: KategorijaBiljke.VOCE,
  [VrstaBiljke.DINJA]: KategorijaBiljke.VOCE,
};

export enum StatusZasadjeneKulture {
  ZASADJENA = 'ZASADJENA',
  AKTIVNA = 'AKTIVNA',
  OBRANA = 'OBRANA',
  PROPALA = 'PROPALA',
}

/** Status same biljke (kulture) — prikazuje se kao badge na kartici.
 *  Mora biti u skladu sa backend enumom StatusBiljke (schema.prisma). */
export enum StatusBiljke {
  POSADJENA = 'POSADJENA',
  RASTE = 'RASTE',
  OBRANA = 'OBRANA',
  PROPALA = 'PROPALA',
}

export const NAZIVI_STATUSA_BILJKE: Record<StatusBiljke, string> = {
  [StatusBiljke.POSADJENA]: 'Posađena',
  [StatusBiljke.RASTE]: 'Raste',
  [StatusBiljke.OBRANA]: 'Obrana',
  [StatusBiljke.PROPALA]: 'Propala',
};

/** Akcije koje farmer može da izvrši nad biljkom. */
export type BiljkaAkcija = 'OBERI' | 'ZALIJ' | 'TRETIRAJ';

export const BILJKA_AKCIJE: readonly BiljkaAkcija[] = ['OBERI', 'ZALIJ', 'TRETIRAJ'] as const;

export const NAZIVI_AKCIJA: Record<BiljkaAkcija, string> = {
  OBERI: 'Berba',
  ZALIJ: 'Navodnjavanje',
  TRETIRAJ: 'Tretman',
};

export interface MesecInterval {
  mesecOd: number;
  mesecDo: number;
}

export interface PeriodPreporuke {
  opis: string;
  setva: readonly MesecInterval[];
  berba: readonly MesecInterval[];
}

export interface ProveraAkcije {
  akcija: BiljkaAkcija;
  biljkaId: number;
  uPeriodu: boolean;
  trenutniStatus: StatusBiljke;
  preporuka: PeriodPreporuke;
  porukaVanPerioda: string | null;
}

export enum Tezina {
  mg = 'mg',
  G = 'G',
  KG = 'KG',
  T = 'T',
}

export const TEZINE_OPCIJE = Object.values(Tezina);

/** Sadnja = zasejana kultura na parceli (usev u toku). */
export interface Sadnja {
  id: number;
  farmerId: number;
  datum: string;
  parcelaId: number;
  biljkaId: number;
  kolicinaPosadjeneKulture: number;
  ocekivaniDatumBerbe?: string | null;
  prinos: number;
  jedinica: Tezina;
  status: StatusZasadjeneKulture;
  biljka?: Biljka;
}

export enum TipPreparata {
  PESTICID = 'PESTICID',
  DJUBRIVO = 'DJUBRIVO',
}

/** Preparat (koristi se i za tretman i za đubrenje - razlikuju se po tipPreparata). */
export interface Preparat {
  id: number;
  naziv: string;
  proizvodjac: string;
  tipPreparata: TipPreparata;
  opis: string;
}

/** Evidentiran tretman (uključujući đubrenje - preparat sa tipPreparata=DJUBRIVO). */
export interface Tretman {
  id: number;
  parcelaId: number;
  biljkaId?: number | null;
  preparatId: number;
  doza: string;
  datumTretmana: string;
}

/** Tip aktivnosti u istoriji parcele — objedinjuje tretmane i navodnjavanja. */
export type TipAktivnosti = 'Đubrenje' | 'Prskanje' | 'Navodnjavanje';

export type StatusAktivnosti = 'Zakazano' | 'Završeno';

export interface DetaljiAktivnosti {
  tipSredstva: string;
  sredstvo: string;
  kolicina: string;
  metod: string;
  potvrdio: string;
}

/** Jedan red u tabeli "Evidencija tretmana" na ekranu Istorija. */
export interface StavkaAktivnosti {
  id: string;
  datum: string;
  tip: TipAktivnosti;
  sredstvo: string;
  kolicina: string;
  status: StatusAktivnosti;
  detalji: DetaljiAktivnosti;
}

/** Istorija sadnje i tretmana za jednu parcelu — vraća je GET /istorija. */
export interface IstorijaParcele {
  id: number;
  naziv: string;
  povrsina: number;
  jedinicaMere: JedinicaPovrsine;
  godina: number | null;
  godineSaZapisima: number[];
  kultura: { naziv: string; vrsta: VrstaBiljke } | null;
  prinosUkupno: number;
  prinosPoHa: number;
  jedinicaPrinosa: Tezina;
  aktivnosti: StavkaAktivnosti[];
}
