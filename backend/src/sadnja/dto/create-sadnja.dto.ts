import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { StatusZasadjeneKulture, Tezina } from '@prisma/client';

export class CreateSadnjaDto {
  @IsInt()
  parcelaId: number;

  @IsInt()
  biljkaId: number;

  @IsInt()
  @Min(1)
  kolicinaPosadjeneKulture: number;

  @IsDateString()
  ocekivaniDatumBerbe: string;

  @IsOptional()
  @IsEnum(StatusZasadjeneKulture)
  status?: StatusZasadjeneKulture;

  @IsOptional()
  @IsInt()
  prinos?: number;

  @IsOptional()
  @IsEnum(Tezina)
  jedinica?: Tezina;
}
