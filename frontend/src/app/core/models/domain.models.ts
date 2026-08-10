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
  MRKVA = 'MRKVA',
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
  [VrstaBiljke.MRKVA]: 'Mrkva',
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
  [VrstaBiljke.MRKVA]: KategorijaBiljke.POVRCE,
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

export enum Tezina {
  mg = 'mg',
  G = 'G',
  KG = 'KG',
  T = 'T',
}

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
