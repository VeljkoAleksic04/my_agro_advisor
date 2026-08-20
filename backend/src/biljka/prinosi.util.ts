import { VrstaBiljke } from '@prisma/client';

export interface OpsegPrinosa {
  /** Minimalan prosecan prinos u tonama po hektaru. */
  minTHa: number;
  /** Maksimalan prosecan prinos u tonama po hektaru. */
  maxTHa: number;
}

/**
 * Realisticni prosecni prinosi (t/ha) po vrsti biljke - koriste se kao
 * podrazumevana vrednost pri berbi kada farmer ne unese prinos rucno
 * (nasumicna vrednost iz opsega, razmerna povrsini parcele), kao i kao
 * vodic/validacija na front-endu (upozorenje ako je unet prinos daleko van
 * ocekivanog opsega).
 */
export const OPSEG_PRINOSA: Record<VrstaBiljke, OpsegPrinosa> = {
  [VrstaBiljke.PSENICA]: { minTHa: 4.5, maxTHa: 6.5 },
  [VrstaBiljke.KUKURUZ]: { minTHa: 6.0, maxTHa: 8.5 },
  [VrstaBiljke.JECAM]: { minTHa: 4.0, maxTHa: 5.5 },
  [VrstaBiljke.OVAS]: { minTHa: 2.5, maxTHa: 4.0 },
  [VrstaBiljke.RAZ]: { minTHa: 3.0, maxTHa: 4.5 },
  [VrstaBiljke.SUNCOKRET]: { minTHa: 2.5, maxTHa: 3.5 },
  [VrstaBiljke.SOJA]: { minTHa: 2.5, maxTHa: 3.5 },
  [VrstaBiljke.SECERNA_REPA]: { minTHa: 55, maxTHa: 70 },
  [VrstaBiljke.KROMPIR]: { minTHa: 25, maxTHa: 40 },
  [VrstaBiljke.PARADAJZ]: { minTHa: 40, maxTHa: 60 },
  [VrstaBiljke.PAPRIKA]: { minTHa: 25, maxTHa: 40 },
  [VrstaBiljke.KRASTAVAC]: { minTHa: 35, maxTHa: 50 },
  [VrstaBiljke.KUPUS]: { minTHa: 40, maxTHa: 60 },
  [VrstaBiljke.LUK]: { minTHa: 35, maxTHa: 50 },
  [VrstaBiljke.BELI_LUK]: { minTHa: 6, maxTHa: 10 },
  [VrstaBiljke.SARGAREPA]: { minTHa: 40, maxTHa: 60 },
  [VrstaBiljke.SALATA]: { minTHa: 20, maxTHa: 30 },
  [VrstaBiljke.TIKVICA]: { minTHa: 30, maxTHa: 50 },
  [VrstaBiljke.LUBENICA]: { minTHa: 40, maxTHa: 70 },
  [VrstaBiljke.DINJA]: { minTHa: 25, maxTHa: 40 },
};

/**
 * Podrazumevani prinos (u kg) za datu vrstu i povrsinu parcele (u hektarima),
 * kada farmer ne unese prinos rucno pri berbi - nasumicna vrednost unutar
 * realistcnog opsega t/ha za tu kulturu, skalirana povrsinom.
 */
export function podrazumevaniPrinosKg(vrsta: VrstaBiljke, povrsinaHa: number): number {
  const opseg = OPSEG_PRINOSA[vrsta];
  const prinosTHa = opseg.minTHa + Math.random() * (opseg.maxTHa - opseg.minTHa);
  const prinosKg = prinosTHa * 1000 * povrsinaHa;
  return Math.round(prinosKg);
}
