import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreparatDto } from './dto/create-preparat.dto';
import { UpdatePreparatDto } from './dto/update-preparat.dto';
import { TipPreparata } from '@prisma/client';

@Injectable()
export class PreparatService {
  constructor(private readonly prisma: PrismaService) {}

  // tacka 11: TipPreparata i pod-tipovi se ne mogu izraziti kao DB constraint
  // pa se validiraju ovde na aplikativnom nivou
  private proveriKonzistentnostTipa(dto: {
    tipPreparata?: TipPreparata;
    tipPesticida?: unknown;
    tipDjubriva?: unknown;
  }) {
    if (dto.tipPreparata === TipPreparata.PESTICID) {
      if (!dto.tipPesticida) {
        throw new BadRequestException('tipPesticida je obavezan kada je tipPreparata=PESTICID');
      }
      if (dto.tipDjubriva) {
        throw new BadRequestException('tipDjubriva ne sme biti postavljen za PESTICID');
      }
    }
    if (dto.tipPreparata === TipPreparata.DJUBRIVO) {
      if (!dto.tipDjubriva) {
        throw new BadRequestException('tipDjubriva je obavezan kada je tipPreparata=DJUBRIVO');
      }
      if (dto.tipPesticida) {
        throw new BadRequestException('tipPesticida ne sme biti postavljen za DJUBRIVO');
      }
    }
  }

  create(dto: CreatePreparatDto) {
    this.proveriKonzistentnostTipa(dto);
    const { sastojci, ...preparatData } = dto;
    return this.prisma.preparat.create({
      data: {
        ...preparatData,
        sastojci: sastojci
          ? {
              create: sastojci.map((s) => ({
                element: s.element,
                kolicina: s.kolicina,
                jedinica: s.jedinica,
              })),
            }
          : undefined,
      },
      include: { sastojci: true },
    });
  }

  findAll() {
    return this.prisma.preparat.findMany({ include: { sastojci: true } });
  }

  async findOne(id: number) {
    const preparat = await this.prisma.preparat.findUnique({
      where: { id },
      include: { sastojci: true },
    });
    if (!preparat) throw new NotFoundException('Preparat ne postoji');
    return preparat;
  }

  async update(id: number, dto: UpdatePreparatDto) {
    await this.findOne(id);
    if (dto.tipPreparata) this.proveriKonzistentnostTipa(dto);
    const { sastojci, ...preparatData } = dto;
    return this.prisma.preparat.update({
      where: { id },
      data: preparatData,
      include: { sastojci: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.preparat.delete({ where: { id } });
  }
}
