import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { JedinicaPovrsine, VrstaBiljke } from '@prisma/client';
import { findIndex } from 'rxjs';

export class CreateBiljkaDto {
  @IsString()
  @MinLength(2)
  naziv: string;

  @IsEnum(VrstaBiljke)
  vrsta: VrstaBiljke;

  @IsInt()
  @Min(1)
  povrsina: number;

  // @IsEnum(JedinicaPovrsine)
  // jedinica : JedinicaPovrsine;

  @IsInt()
  parcelaId: number;

  @IsOptional()
  @IsInt()
  preporucenaTemperaturaC?: number;

  @IsOptional()
  @IsInt()
  preporucenoDjubrivoId?: number;
}