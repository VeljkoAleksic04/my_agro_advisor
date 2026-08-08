import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNavodnjavanjeDto {
  @IsOptional()
  @IsInt()
  parcelaId?: number;

  @IsOptional()
  @IsDateString()
  datumNavodnjavanja?: string;

  @IsString()
  napomena: string;
}
