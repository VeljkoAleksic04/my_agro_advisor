import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { BILJKA_AKCIJE, BiljkaAkcijaTip } from './izvrsi-akciju.dto';

export class AkcijaBiljkeDto {
  @IsIn(BILJKA_AKCIJE)
  akcija: BiljkaAkcijaTip;

  /**
   * Ako je true, akcija se izvrsava bez obzira sto nije u preporucenom periodu.
   * Frontend ovaj flag postavlja tek kada korisnik potvrdi modal.
   */
  @IsOptional()
  @IsBoolean()
  forsirajVanPerioda?: boolean;
}
