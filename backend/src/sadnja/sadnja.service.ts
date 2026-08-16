import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSadnjaDto } from './dto/create-sadnja.dto';
import { UpdateSadnjaDto } from './dto/update-sadnja.dto';

@Injectable()
export class SadnjaService {
  constructor(private readonly prisma: PrismaService) {}

  private async proveriVlasnistvo(parcelaId: number, korisnikId: number) {
    const parcela = await this.prisma.parcela.findUnique({ where: { id: parcelaId } });
    if (!parcela) throw new NotFoundException('Parcela ne postoji');
    if (parcela.vlasnikId !== korisnikId) {
      throw new ForbiddenException('Parcela ne pripada ulogovanom korisniku');
    }
  }

  async create(korisnikId: number, dto: CreateSadnjaDto) {
    await this.proveriVlasnistvo(dto.parcelaId, korisnikId);

    // Naziv i vrsta kulture se "snapshot"-uju u trenutku sadnje - Sadnja
    // ostaje citljiva (npr. na ekranu Istorija/Statistics) i nakon sto
    // biljka bude obrisana pri berbi (videti BiljkaService.zavrsiBerbu).
    const biljka = await this.prisma.biljka.findUnique({ where: { id: dto.biljkaId } });
    if (!biljka) throw new NotFoundException('Biljka ne postoji');

    return this.prisma.sadnja.create({
      data: {
        ...dto,
        farmerId: korisnikId,
        nazivKulture: biljka.naziv,
        vrstaKulture: biljka.vrsta,
        ocekivaniDatumBerbe: dto.ocekivaniDatumBerbe ? new Date(dto.ocekivaniDatumBerbe) : undefined,
      },
    });
  }

  findAllZaKorisnika(korisnikId: number) {
    return this.prisma.sadnja.findMany({
      where: { farmerId: korisnikId },
      include: { biljka: true, parcela: true },
      orderBy: { datum: 'desc' },
    });
  }

  async findOne(id: number) {
    const sadnja = await this.prisma.sadnja.findUnique({
      where: { id },
      include: { biljka: true, parcela: true },
    });
    if (!sadnja) throw new NotFoundException('Sadnja ne postoji');
    return sadnja;
  }

  async update(id: number, korisnikId: number, dto: UpdateSadnjaDto) {
    const sadnja = await this.findOne(id);
    if (sadnja.farmerId !== korisnikId) {
      throw new ForbiddenException('Sadnja ne pripada ulogovanom korisniku');
    }
    return this.prisma.sadnja.update({
      where: { id },
      data: {
        ...dto,
        ocekivaniDatumBerbe: dto.ocekivaniDatumBerbe
          ? new Date(dto.ocekivaniDatumBerbe)
          : undefined,
      },
    });
  }

  async remove(id: number, korisnikId: number) {
    const sadnja = await this.findOne(id);
    if (sadnja.farmerId !== korisnikId) {
      throw new ForbiddenException('Sadnja ne pripada ulogovanom korisniku');
    }
    return this.prisma.sadnja.delete({ where: { id } });
  }
}
