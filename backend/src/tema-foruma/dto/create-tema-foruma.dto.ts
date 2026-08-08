import { IsString, MinLength } from 'class-validator';

export class CreateTemaForumaDto {
  @IsString()
  @MinLength(3)
  naslov: string;

  @IsString()
  @MinLength(3)
  opis: string;
}
