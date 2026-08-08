import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTretmanDto {
  @IsInt()
  parcelaId: number;

  @IsOptional()
  @IsInt()
  biljkaId?: number;

  @IsInt()
  preparatId: number;

  @IsString()
  doza: string;

  @IsOptional()
  @IsDateString()
  datumTretmana?: string;
}
