import { IsDateString, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  ime: string;

  @IsString()
  @MinLength(2)
  prezime: string;

  @IsEmail()
  email: string;

  @IsDateString()
  datumRodjenja: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
