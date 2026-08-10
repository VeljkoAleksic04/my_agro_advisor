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

  // Dashboard: sejanje se radi bez eksplicitnog navodjenja datuma,
  // pa je ovo polje sada opciono (moze naknadno da se popuni preko update-a).
  @IsOptional()
  @IsDateString()
  ocekivaniDatumBerbe?: string;

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
