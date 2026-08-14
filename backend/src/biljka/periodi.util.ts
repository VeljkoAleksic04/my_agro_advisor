import { VrstaBiljke } from '@prisma/client';

export interface MesecInterval {
  mesecOd: number;
  mesecDo: number;
}

export interface PeriodPreporuke {
  opis: string;
  setva: readonly MesecInterval[];
  berba: readonly MesecInterval[];
}

const m = (mesecOd: number, mesecDo: number): MesecInterval => ({ mesecOd, mesecDo });

/**
 * Preporuceni periodi sadnje/setve i berbe po vrsti biljke. Mora biti u
 * skladu sa frontend/src/app/features/biljke/periodi.util.ts (isti izvor
 * istine, korisceno i za front-end preview i za backend validaciju).
 */
export const PERIODI_SADNJE_BERBE: Record<VrstaBiljke, PeriodPreporuke> = {
  [VrstaBiljke.PSENICA]: {
    opis: 'Pšenica: setva oktobar-novembar (ozima) ili mart-april (jara); žetva jun-jul (ozima) ili jul-avgust (jara).',
    setva: [m(10, 11), m(3, 4)],
    berba: [m(6, 7), m(7, 8)],
  },
  [VrstaBiljke.KUKURUZ]: {
    opis: 'Kukuruz: setva april-maj; žetva septembar-oktobar.',
    setva: [m(4, 5)],
    berba: [m(9, 10)],
  },
  [VrstaBiljke.JECAM]: {
    opis: 'Ječam: setva septembar-oktobar (ozimi) ili februar-mart (jari); žetva jun (ozimi) ili jun-jul (jari).',
    setva: [m(9, 10), m(2, 3)],
    berba: [m(6, 6), m(6, 7)],
  },
  [VrstaBiljke.OVAS]: {
    opis: 'Ovas: setva februar-mart; žetva jul-avgust.',
    setva: [m(2, 3)],
    berba: [m(7, 8)],
  },
  [VrstaBiljke.RAZ]: {
    opis: 'Raž: setva septembar-oktobar; žetva jun-jul.',
    setva: [m(9, 10)],
    berba: [m(6, 7)],
  },
  [VrstaBiljke.SUNCOKRET]: {
    opis: 'Suncokret: setva april; žetva avgust-septembar.',
    setva: [m(4, 4)],
    berba: [m(8, 9)],
  },
  [VrstaBiljke.SOJA]: {
    opis: 'Soja: setva april-maj; žetva septembar-oktobar.',
    setva: [m(4, 5)],
    berba: [m(9, 10)],
  },
  [VrstaBiljke.SECERNA_REPA]: {
    opis: 'Šećerna repa: setva mart-april; vađenje septembar-novembar.',
    setva: [m(3, 4)],
    berba: [m(9, 11)],
  },
  [VrstaBiljke.KROMPIR]: {
    opis: 'Krompir: sadnja mart-april; vađenje jun-oktobar.',
    setva: [m(3, 4)],
    berba: [m(6, 10)],
  },
  [VrstaBiljke.PARADAJZ]: {
    opis: 'Paradajz: sadnja maj; berba jul-oktobar.',
    setva: [m(5, 5)],
    berba: [m(7, 10)],
  },
  [VrstaBiljke.PAPRIKA]: {
    opis: 'Paprika: sadnja maj; berba avgust-oktobar.',
    setva: [m(5, 5)],
    berba: [m(8, 10)],
  },
  [VrstaBiljke.KRASTAVAC]: {
    opis: 'Krastavac: sadnja april-maj; berba jun-septembar.',
    setva: [m(4, 5)],
    berba: [m(6, 9)],
  },
  [VrstaBiljke.KUPUS]: {
    opis: 'Kupus: sadnja mart-jul; berba maj-novembar.',
    setva: [m(3, 7)],
    berba: [m(5, 11)],
  },
  [VrstaBiljke.LUK]: {
    opis: 'Crni luk: sadnja mart-april; berba jul-avgust.',
    setva: [m(3, 4)],
    berba: [m(7, 8)],
  },
  [VrstaBiljke.BELI_LUK]: {
    opis: 'Beli luk: sadnja mart; berba jul-avgust.',
    setva: [m(3, 3)],
    berba: [m(7, 8)],
  },
  [VrstaBiljke.SARGAREPA]: {
    opis: 'Šargarepa: sadnja mart-april; vađenje jun-jul.',
    setva: [m(3, 4)],
    berba: [m(6, 7)],
  },
  [VrstaBiljke.SALATA]: {
    opis: 'Salata: setva februar-mart; berba april-maj.',
    setva: [m(2, 3)],
    berba: [m(4, 5)],
  },
  [VrstaBiljke.TIKVICA]: {
    opis: 'Tikvica: setva april-maj; berba jun-septembar.',
    setva: [m(4, 5)],
    berba: [m(6, 9)],
  },
  [VrstaBiljke.LUBENICA]: {
    opis: 'Lubenica: sadnja maj; berba jul-septembar.',
    setva: [m(5, 9)],
    berba: [m(7, 9)],
  },
  [VrstaBiljke.DINJA]: {
    opis: 'Dinja: sadnja maj; berba jul-avgust.',
    setva: [m(5, 5)],
    berba: [m(7, 8)],
  },
};

export function preporukaZaVrstu(vrsta: VrstaBiljke): PeriodPreporuke {
  return PERIODI_SADNJE_BERBE[vrsta];
}

function mesecUIntervalu(mesec: number, interval: MesecInterval): boolean {
  const { mesecOd, mesecDo } = interval;
  return mesecOd <= mesecDo
    ? mesec >= mesecOd && mesec <= mesecDo
    : mesec >= mesecOd || mesec <= mesecDo;
}

export function jeMesecUPeriodu(mesec: number, intervali: readonly MesecInterval[]): boolean {
  return intervali.some((interval) => mesecUIntervalu(mesec, interval));
}
