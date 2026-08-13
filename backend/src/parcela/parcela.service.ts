import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';

@Injectable()
export class ParcelaService {
  constructor(private readonly prisma: PrismaService) {}

  create(vlasnikId: number, dto: CreateParcelaDto) {
    return this.prisma.parcela.create({
      data: { ...dto, vlasnikId },
    });
  }

  findAllZaKorisnika(vlasnikId: number) {
    return this.prisma.parcela.findMany({
      where: { vlasnikId },
      orderBy: { datumUpisa: 'desc' },
      // _count.biljke se koristi na front-endu za bedž "broj kultura" na kartici u listi
      include: { _count: { select: { biljke: true } } },
    });
  }

  async findOne(id: number, vlasnikId: number) {
    const parcela = await this.prisma.parcela.findUnique({
      where: { id },
      include: { biljke: true, sadnje: true },
    });
    if (!parcela) throw new NotFoundException('Parcela ne postoji');
    if (parcela.vlasnikId !== vlasnikId) {
      throw new ForbiddenException('Nemate pristup ovoj parceli');
    }
    return parcela;
  }

  async update(id: number, vlasnikId: number, dto: UpdateParcelaDto) {
    await this.findOne(id, vlasnikId);
    return this.prisma.parcela.update({ where: { id }, data: dto });
  }

  async remove(id: number, vlasnikId: number) {
    await this.findOne(id, vlasnikId);
    return this.prisma.parcela.delete({ where: { id } });
  }
}
