import { IsString, MinLength } from 'class-validator';

export class PromeniLozinkuDto {
  @IsString()
  trenutnaLozinka: string;

  @IsString()
  @MinLength(6)
  novaLozinka: string;
}
