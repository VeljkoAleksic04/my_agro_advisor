import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePorukaForumaDto {
  @IsInt()
  temaId: number;

  @IsString()
  @MinLength(1)
  sadrzaj: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
