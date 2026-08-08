import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemaForumaDto } from './dto/create-tema-foruma.dto';
import { UpdateTemaForumaDto } from './dto/update-tema-foruma.dto';

@Injectable()
export class TemaForumaService {
  constructor(private readonly prisma: PrismaService) {}

  create(korisnikId: number, dto: CreateTemaForumaDto) {
    return this.prisma.temaForuma.create({
      data: { ...dto, farmerId: korisnikId },
    });
  }

  findAll() {
    return this.prisma.temaForuma.findMany({
      include: { farmer: { select: { id: true, ime: true, prezime: true, username: true } } },
      orderBy: { datumKreiranja: 'desc' },
    });
  }

  async findOne(id: number) {
    const tema = await this.prisma.temaForuma.findUnique({
      where: { id },
      include: {
        farmer: { select: { id: true, ime: true, prezime: true, username: true } },
        poruke: { orderBy: { datumKreiranja: 'asc' } },
      },
    });
    if (!tema) throw new NotFoundException('Tema ne postoji');
    return tema;
  }

  async update(id: number, korisnikId: number, dto: UpdateTemaForumaDto) {
    const tema = await this.findOne(id);
    if (tema.farmerId !== korisnikId) {
      throw new ForbiddenException('Ne mozete izmeniti tudju temu');
    }
    return this.prisma.temaForuma.update({ where: { id }, data: dto });
  }

  async remove(id: number, korisnikId: number) {
    const tema = await this.findOne(id);
    if (tema.farmerId !== korisnikId) {
      throw new ForbiddenException('Ne mozete obrisati tudju temu');
    }
    return this.prisma.temaForuma.delete({ where: { id } });
  }
}
