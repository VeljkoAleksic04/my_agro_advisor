import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoljoprivrednikService {
  constructor(private readonly prisma: PrismaService) {}

  istorijaPoena(korisnikId: number) {
    return this.prisma.transakcijaPoena.findMany({
      where: { farmerId: korisnikId },
      orderBy: { datumTransakcije: 'desc' },
    });
  }
}
