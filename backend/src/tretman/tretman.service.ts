import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTretmanDto } from './dto/create-tretman.dto';
import { UpdateTretmanDto } from './dto/update-tretman.dto';

@Injectable()
export class TretmanService {
  constructor(private readonly prisma: PrismaService) {}

  private async proveriVlasnistvo(parcelaId: number, korisnikId: number) {
    const parcela = await this.prisma.parcela.findUnique({ where: { id: parcelaId } });
    if (!parcela) throw new NotFoundException('Parcela ne postoji');
    if (parcela.vlasnikId !== korisnikId) {
      throw new ForbiddenException('Parcela ne pripada ulogovanom korisniku');
    }
  }

  async create(korisnikId: number, dto: CreateTretmanDto) {
    await this.proveriVlasnistvo(dto.parcelaId, korisnikId);
    return this.prisma.tretman.create({
      data: {
        ...dto,
        datumTretmana: dto.datumTretmana ? new Date(dto.datumTretmana) : undefined,
      },
    });
  }

  findAllZaParcelu(parcelaId: number) {
    return this.prisma.tretman.findMany({
      where: { parcelaId },
      include: { preparat: true, biljka: true },
      orderBy: { datumTretmana: 'desc' },
    });
  }

  async findOne(id: number) {
    const tretman = await this.prisma.tretman.findUnique({
      where: { id },
      include: { preparat: true, biljka: true },
    });
    if (!tretman) throw new NotFoundException('Tretman ne postoji');
    return tretman;
  }

  async update(id: number, korisnikId: number, dto: UpdateTretmanDto) {
    const tretman = await this.findOne(id);
    await this.proveriVlasnistvo(dto.parcelaId ?? tretman.parcelaId, korisnikId);
    return this.prisma.tretman.update({
      where: { id },
      data: {
        ...dto,
        datumTretmana: dto.datumTretmana ? new Date(dto.datumTretmana) : undefined,
      },
    });
  }

  async remove(id: number, korisnikId: number) {
    const tretman = await this.findOne(id);
    await this.proveriVlasnistvo(tretman.parcelaId, korisnikId);
    return this.prisma.tretman.delete({ where: { id } });
  }
}
