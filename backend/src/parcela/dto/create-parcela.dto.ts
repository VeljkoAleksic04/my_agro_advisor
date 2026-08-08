import { IsEnum, IsInt, IsString, MinLength } from 'class-validator';
import { JedinicaPovrsine } from '@prisma/client';

export class CreateParcelaDto {
  @IsString()
  @MinLength(2)
  naziv: string;

  @IsInt()
  povrsina: number;

  @IsEnum(JedinicaPovrsine)
  jedinicaMere: JedinicaPovrsine;

  @IsInt()
  klasa: number;
}
