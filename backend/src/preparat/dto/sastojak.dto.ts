import { IsEnum, IsInt, Min } from 'class-validator';
import { Elementi, Tezina } from '@prisma/client';

export class SastojakDto {
  @IsEnum(Elementi)
  element: Elementi;

  @IsInt()
  @Min(1)
  kolicina: number;

  @IsEnum(Tezina)
  jedinica: Tezina;
}
