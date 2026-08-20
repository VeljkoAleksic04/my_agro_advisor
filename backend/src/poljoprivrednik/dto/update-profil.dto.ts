import { IsDateString, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfilDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  ime?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  prezime?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  datumRodjenja?: string;

  @IsOptional()
  @IsString()
  brojTelefona?: string;

  @IsOptional()
  @IsString()
  slika?: string;
}
