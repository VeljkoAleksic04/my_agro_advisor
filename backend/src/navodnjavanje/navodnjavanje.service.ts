import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNavodnjavanjeDto } from './dto/create-navodnjavanje.dto';
import { UpdateNavodnjavanjeDto } from './dto/update-navodnjavanje.dto';

@Injectable()
export class NavodnjavanjeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(korisnikId: number, dto: CreateNavodnjavanjeDto) {
    if (dto.parcelaId) {
      const parcela = await this.prisma.parcela.findUnique({ where: { id: dto.parcelaId } });
      if (!parcela) throw new NotFoundException('Parcela ne postoji');
      if (parcela.vlasnikId !== korisnikId) {
        throw new ForbiddenException('Parcela ne pripada ulogovanom korisniku');
      }
    }
    return this.prisma.navodnjavanje.create({
      data: {
        ...dto,
        farmerId: korisnikId,
        datumNavodnjavanja: dto.datumNavodnjavanja ? new Date(dto.datumNavodnjavanja) : undefined,
      },
    });
  }

  findAllZaKorisnika(korisnikId: number) {
    return this.prisma.navodnjavanje.findMany({
      where: { farmerId: korisnikId },
      include: { parcela: true },
      orderBy: { datumNavodnjavanja: 'desc' },
    });
  }

  async findOne(id: number) {
    const zapis = await this.prisma.navodnjavanje.findUnique({
      where: { id },
      include: { parcela: true },
    });
    if (!zapis) throw new NotFoundException('Zapis ne postoji');
    return zapis;
  }

  async update(id: number, korisnikId: number, dto: UpdateNavodnjavanjeDto) {
    const zapis = await this.findOne(id);
    if (zapis.farmerId !== korisnikId) {
      throw new ForbiddenException('Zapis ne pripada ulogovanom korisniku');
    }
    return this.prisma.navodnjavanje.update({
      where: { id },
      data: {
        ...dto,
        datumNavodnjavanja: dto.datumNavodnjavanja ? new Date(dto.datumNavodnjavanja) : undefined,
      },
    });
  }

  async remove(id: number, korisnikId: number) {
    const zapis = await this.findOne(id);
    if (zapis.farmerId !== korisnikId) {
      throw new ForbiddenException('Zapis ne pripada ulogovanom korisniku');
    }
    return this.prisma.navodnjavanje.delete({ where: { id } });
  }
}
