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
      include: {
        farmer: { select: { id: true, ime: true, prezime: true, username: true, slika: true } },
        _count: { select: { poruke: true, reakcije: true } },
      },
    });
  }

  findAll(pretraga?: string) {
    const tekstPretrage = pretraga?.trim();

    return this.prisma.temaForuma.findMany({
      where: tekstPretrage
        ? {
            OR: [
              { naslov: { contains: tekstPretrage, mode: 'insensitive' } },
              { farmer: { username: { contains: tekstPretrage, mode: 'insensitive' } } },
            ],
          }
        : undefined,
      include: {
        farmer: { select: { id: true, ime: true, prezime: true, username: true, slika: true } },
        _count: { select: { poruke: true, reakcije: true } },
      },
      orderBy: { datumKreiranja: 'desc' },
    });
  }

  async findOne(id: number) {
    const tema = await this.prisma.temaForuma.findUnique({
      where: { id },
      include: {
        farmer: { select: { id: true, ime: true, prezime: true, username: true, slika: true } },
        poruke: {
          include: {
            autor: { select: { id: true, ime: true, prezime: true, username: true, slika: true } },
            _count: { select: { reakcije: true, odgovori: true } },
          },
          orderBy: { datumKreiranja: 'asc' },
        },
        _count: { select: { poruke: true, reakcije: true } },
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

  async promeniReakciju(id: number, korisnikId: number) {
    await this.proveriTemu(id);

    const postojeca = await this.prisma.reakcijaNaTemu.findUnique({
      where: { idPost_idFarmera: { idPost: id, idFarmera: korisnikId } },
    });

    if (postojeca) {
      await this.prisma.reakcijaNaTemu.delete({ where: { id: postojeca.id } });
    } else {
      await this.prisma.reakcijaNaTemu.create({
        data: { idPost: id, idFarmera: korisnikId },
      });
    }

    const brojReakcija = await this.prisma.reakcijaNaTemu.count({ where: { idPost: id } });
    return { brojReakcija, reagovao: !postojeca };
  }

  private async proveriTemu(id: number) {
    const tema = await this.prisma.temaForuma.findUnique({ where: { id } });
    if (!tema) throw new NotFoundException('Tema ne postoji');
    return tema;
  }
}
