import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  JedinicaKarence,
  TipDjubriva,
  TipPesticida,
  TipPreparata,
} from '@prisma/client';
import { SastojakDto } from './sastojak.dto';

export class CreatePreparatDto {
  @IsString()
  @MinLength(2)
  naziv: string;

  @IsString()
  proizvodjac: string;

  @IsInt()
  trajanjeKarence: number;

  @IsEnum(JedinicaKarence)
  jedinicaKarence: JedinicaKarence;

  @IsEnum(TipPreparata)
  tipPreparata: TipPreparata;

  @IsOptional()
  @IsEnum(TipPesticida)
  tipPesticida?: TipPesticida;

  @IsOptional()
  @IsEnum(TipDjubriva)
  tipDjubriva?: TipDjubriva;

  @IsString()
  opis: string;

  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SastojakDto)
  sastojci?: SastojakDto[];
}
