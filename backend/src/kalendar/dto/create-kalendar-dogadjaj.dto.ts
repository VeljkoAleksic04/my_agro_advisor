import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateKalendarDogadjajDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  naslov: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  opis?: string;

  @IsDateString()
  datumPocetka: string;

  @IsOptional()
  @IsDateString()
  datumKraja?: string;
}
