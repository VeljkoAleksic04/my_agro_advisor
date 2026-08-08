import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBiljkaDto } from './dto/create-biljka.dto';
import { UpdateBiljkaDto } from './dto/update-biljka.dto';

@Injectable()
export class BiljkaService {
  constructor(private readonly prisma: PrismaService) {}

  private async proveriVlasnistvoParcele(parcelaId: number, korisnikId: number) {
    const parcela = await this.prisma.parcela.findUnique({ where: { id: parcelaId } });
    if (!parcela) throw new NotFoundException('Parcela ne postoji');
    if (parcela.vlasnikId !== korisnikId) {
      throw new ForbiddenException('Parcela ne pripada ulogovanom korisniku');
    }
  }

  async create(korisnikId: number, dto: CreateBiljkaDto) {
    await this.proveriVlasnistvoParcele(dto.parcelaId, korisnikId);
    try {
      return await this.prisma.biljka.create({
        data: {
          naziv: dto.naziv,
          vrsta: dto.vrsta,
          pocetakSadnje: new Date(dto.pocetakSadnje),
          krajSadnje: new Date(dto.krajSadnje),
          pocetakBerbe: new Date(dto.pocetakBerbe),
          krajBerbe: new Date(dto.krajBerbe),
          preporucenaTemperaturaC: dto.preporucenaTemperaturaC,
          parcelaId: dto.parcelaId,
          preporucenoDjubrivoId: dto.preporucenoDjubrivoId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'Ta sorta paprike je vec zasadjena na ovoj parceli',
        );
      }
      throw e;
    }
  }

  findAllZaParcelu(parcelaId: number) {
    return this.prisma.biljka.findMany({ where: { parcelaId } });
  }

  async findOne(id: number) {
    const biljka = await this.prisma.biljka.findUnique({ where: { id } });
    if (!biljka) throw new NotFoundException('Biljka ne postoji');
    return biljka;
  }

  async update(id: number, korisnikId: number, dto: UpdateBiljkaDto) {
    const biljka = await this.findOne(id);
    await this.proveriVlasnistvoParcele(dto.parcelaId ?? biljka.parcelaId, korisnikId);
    try {
      return await this.prisma.biljka.update({
        where: { id },
        data: {
          ...dto,
          pocetakSadnje: dto.pocetakSadnje ? new Date(dto.pocetakSadnje) : undefined,
          krajSadnje: dto.krajSadnje ? new Date(dto.krajSadnje) : undefined,
          pocetakBerbe: dto.pocetakBerbe ? new Date(dto.pocetakBerbe) : undefined,
          krajBerbe: dto.krajBerbe ? new Date(dto.krajBerbe) : undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'Ta sorta paprike je vec zasadjena na ovoj parceli',
        );
      }
      throw e;
    }
  }

  async remove(id: number, korisnikId: number) {
    const biljka = await this.findOne(id);
    await this.proveriVlasnistvoParcele(biljka.parcelaId, korisnikId);
    return this.prisma.biljka.delete({ where: { id } });
  }
}
