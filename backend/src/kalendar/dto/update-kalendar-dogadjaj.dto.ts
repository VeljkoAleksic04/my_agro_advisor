import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateKalendarDogadjajDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  naslov?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  opis?: string;

  @IsOptional()
  @IsDateString()
  datumPocetka?: string;

  @IsOptional()
  @IsDateString()
  datumKraja?: string;
}
