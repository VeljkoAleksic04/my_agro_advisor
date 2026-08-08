import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { SortaPaprike } from '@prisma/client';

export class CreateBiljkaDto {
  @IsString()
  @MinLength(2)
  naziv: string;

  @IsEnum(SortaPaprike)
  vrsta: SortaPaprike;

  @IsDateString()
  pocetakSadnje: string;

  @IsDateString()
  krajSadnje: string;

  @IsDateString()
  pocetakBerbe: string;

  @IsDateString()
  krajBerbe: string;

  @IsInt()
  preporucenaTemperaturaC: number;

  @IsInt()
  parcelaId: number;

  @IsOptional()
  @IsInt()
  preporucenoDjubrivoId?: number;
}
