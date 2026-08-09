import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { VrstaBiljke } from '@prisma/client';

export class CreateBiljkaDto {
  @IsString()
  @MinLength(2)
  naziv: string;

  @IsEnum(VrstaBiljke)
  vrsta: VrstaBiljke;

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
