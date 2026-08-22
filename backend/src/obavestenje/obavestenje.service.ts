import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ObavestenjeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(korisnikId: number) {
    return this.prisma.obavestenje.findMany({
      where: { korisnikId },
      orderBy: { datumKreiranja: 'desc' },
      take: 50,
    });
  }

  async neprocitana(korisnikId: number) {
    return this.prisma.obavestenje.count({
      where: { korisnikId, procitano: false },
    });
  }

  async procitaj(id: number, korisnikId: number) {
    const obavestenje = await this.prisma.obavestenje.findFirst({
      where: { id, korisnikId },
    });
    if (!obavestenje) throw new NotFoundException('Obaveštenje ne postoji');

    return this.prisma.obavestenje.update({
      where: { id },
      data: { procitano: true },
    });
  }

  async procitajSva(korisnikId: number) {
    await this.prisma.obavestenje.updateMany({
      where: { korisnikId, procitano: false },
      data: { procitano: true },
    });
    return { uspesno: true };
  }

  kreiraj(data: {
    korisnikId: number;
    tip: string;
    poruka: string;
    temaId?: number;
    porukaId?: number;
  }) {
    return this.prisma.obavestenje.create({ data });
  }
}
