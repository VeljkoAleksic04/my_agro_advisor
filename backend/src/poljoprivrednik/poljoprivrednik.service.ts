import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { PromeniLozinkuDto } from './dto/promeni-lozinku.dto';

const SALT_ROUNDS = 10;

/** Polja koja se vracaju za profil - eksplicitno bez password hash-a. */
const PROFIL_SELEKCIJA = {
  id: true,
  ime: true,
  prezime: true,
  email: true,
  datumRodjenja: true,
  username: true,
  brojTelefona: true,
  slika: true,
  uloga: true,
  ukupnoPoena: true,
  kreiranDana: true,
} as const;

@Injectable()
export class PoljoprivrednikService {
  constructor(private readonly prisma: PrismaService) {}

  istorijaPoena(korisnikId: number) {
    return this.prisma.transakcijaPoena.findMany({
      where: { farmerId: korisnikId },
      orderBy: { datumTransakcije: 'desc' },
    });
  }

  async pregled(korisnikId: number) {
    const korisnik = await this.prisma.poljoprivrednik.findUnique({
      where: { id: korisnikId },
      select: PROFIL_SELEKCIJA,
    });
    if (!korisnik) throw new NotFoundException('Korisnik ne postoji');
    return korisnik;
  }

  async azurirajProfil(korisnikId: number, dto: UpdateProfilDto) {
    if (dto.email) {
      const postoji = await this.prisma.poljoprivrednik.findUnique({ where: { email: dto.email } });
      if (postoji && postoji.id !== korisnikId) {
        throw new ConflictException('Email je vec u upotrebi');
      }
    }

    const korisnik = await this.prisma.poljoprivrednik.update({
      where: { id: korisnikId },
      data: {
        ime: dto.ime,
        prezime: dto.prezime,
        email: dto.email,
        datumRodjenja: dto.datumRodjenja ? new Date(dto.datumRodjenja) : undefined,
        brojTelefona: dto.brojTelefona,
        slika: dto.slika,
      },
      select: PROFIL_SELEKCIJA,
    });
    return korisnik;
  }

  async promeniLozinku(korisnikId: number, dto: PromeniLozinkuDto) {
    const korisnik = await this.prisma.poljoprivrednik.findUnique({ where: { id: korisnikId } });
    if (!korisnik) throw new NotFoundException('Korisnik ne postoji');

    const poklapaSe = await bcrypt.compare(dto.trenutnaLozinka, korisnik.password);
    if (!poklapaSe) {
      throw new UnauthorizedException('Trenutna lozinka nije tacna');
    }

    const noviHash = await bcrypt.hash(dto.novaLozinka, SALT_ROUNDS);
    await this.prisma.poljoprivrednik.update({
      where: { id: korisnikId },
      data: { password: noviHash },
    });
    return { poruka: 'Lozinka je uspesno promenjena' };
  }
}
