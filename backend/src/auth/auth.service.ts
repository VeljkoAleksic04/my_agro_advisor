import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UlogaKorisnika } from '@prisma/client';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const postojiEmail = await this.prisma.poljoprivrednik.findUnique({
      where: { email: dto.email },
    });
    if (postojiEmail) {
      throw new ConflictException('Email je vec u upotrebi');
    }
    const postojiUsername = await this.prisma.poljoprivrednik.findUnique({
      where: { username: dto.username },
    });
    if (postojiUsername) {
      throw new ConflictException('Korisnicko ime je vec u upotrebi');
    }

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const korisnik = await this.prisma.poljoprivrednik.create({
      data: {
        ime: dto.ime,
        prezime: dto.prezime,
        email: dto.email,
        datumRodjenja: new Date(dto.datumRodjenja),
        username: dto.username,
        password: hash,
        uloga: UlogaKorisnika.FARMER,
      },
    });

    return this.izdajToken(korisnik.id, korisnik.username, korisnik.uloga);
  }

  async login(dto: LoginDto) {
    const korisnik = await this.prisma.poljoprivrednik.findUnique({
      where: { username: dto.username },
    });
    if (!korisnik) {
      throw new UnauthorizedException('Pogresno korisnicko ime ili lozinka');
    }
    const poklapaSe = await bcrypt.compare(dto.password, korisnik.password);
    if (!poklapaSe) {
      throw new UnauthorizedException('Pogresno korisnicko ime ili lozinka');
    }
    return this.izdajToken(korisnik.id, korisnik.username, korisnik.uloga);
  }

  private izdajToken(sub: number, username: string, uloga: string) {
    const token = this.jwtService.sign({ sub, username, uloga });
    return {
      access_token: token,
      korisnik: { id: sub, username, uloga },
    };
  }
}
