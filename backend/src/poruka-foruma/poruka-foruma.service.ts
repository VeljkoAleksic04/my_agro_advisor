import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePorukaForumaDto } from './dto/create-poruka-foruma.dto';

@Injectable()
export class PorukaForumaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(korisnikId: number, dto: CreatePorukaForumaDto) {
    const tema = await this.prisma.temaForuma.findUnique({ where: { id: dto.temaId } });
    if (!tema) throw new NotFoundException('Tema ne postoji');
    return this.prisma.porukaForuma.create({
      data: { ...dto, autorId: korisnikId },
    });
  }

  findAllZaTemu(temaId: number) {
    return this.prisma.porukaForuma.findMany({
      where: { temaId },
      include: { autor: { select: { id: true, ime: true, prezime: true, username: true } } },
      orderBy: { datumKreiranja: 'asc' },
    });
  }

  async remove(id: number, korisnikId: number) {
    const poruka = await this.prisma.porukaForuma.findUnique({ where: { id } });
    if (!poruka) throw new NotFoundException('Poruka ne postoji');
    if (poruka.autorId !== korisnikId) {
      throw new ForbiddenException('Ne mozete obrisati tudju poruku');
    }
    return this.prisma.porukaForuma.delete({ where: { id } });
  }
}
