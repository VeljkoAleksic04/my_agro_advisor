import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export const BILJKA_AKCIJE = ['OBERI', 'ZALIJ', 'TRETIRAJ'] as const;
export type BiljkaAkcijaTip = (typeof BILJKA_AKCIJE)[number];

export class IzvrsiAkcijuDto {
  @IsIn(BILJKA_AKCIJE)
  akcija: BiljkaAkcijaTip;

  // Kada je true, akcija se izvrsava iako datum odstupa od preporucenog
  // perioda (korisnik je potvrdio upozorenje u modalu na front-endu).
  @IsOptional()
  @IsBoolean()
  forsirajVanPerioda?: boolean;

  // Rucno unet prinos (u kg) pri berbi (akcija OBERI). Ako se ne posalje,
  // backend generise realisticnu podrazumevanu vrednost na osnovu opsega
  // t/ha za tu vrstu biljke i povrsine parcele (videti prinosi.util.ts).
  @IsOptional()
  @IsInt()
  @Min(0)
  prinosKg?: number;
}
