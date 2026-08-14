import { IsBoolean, IsIn, IsOptional } from 'class-validator';

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
}
