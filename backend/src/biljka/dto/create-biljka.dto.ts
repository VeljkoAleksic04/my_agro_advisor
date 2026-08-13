import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { VrstaBiljke } from '@prisma/client';

export class CreateBiljkaDto {
  @IsString()
  @MinLength(2)
  naziv: string;

  @IsEnum(VrstaBiljke)
  vrsta: VrstaBiljke;

  @IsInt()
  @Min(1)
  povrsina: number;

  @IsInt()
  parcelaId: number;

  @IsOptional()
  @IsInt()
  preporucenaTemperaturaC?: number;

  @IsOptional()
  @IsInt()
  preporucenoDjubrivoId?: number;
}