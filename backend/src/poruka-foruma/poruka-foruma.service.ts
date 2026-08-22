import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePorukaForumaDto } from './dto/create-poruka-foruma.dto';
import { ObavestenjeService } from '../obavestenje/obavestenje.service';

@Injectable()
export class PorukaForumaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly obavestenjeService: ObavestenjeService,
  ) {}

  async create(korisnikId: number, dto: CreatePorukaForumaDto) {
    const tema = await this.prisma.temaForuma.findUnique({ where: { id: dto.temaId } });
    if (!tema) throw new NotFoundException('Tema ne postoji');

    if (dto.parentId) {
      const roditelj = await this.prisma.porukaForuma.findUnique({ where: { id: dto.parentId } });
      if (!roditelj || roditelj.temaId !== dto.temaId) {
        throw new NotFoundException('Komentar na koji odgovarate ne postoji');
      }
    }

    const poruka = await this.prisma.porukaForuma.create({
      data: { ...dto, autorId: korisnikId },
      include: {
        autor: { select: { id: true, ime: true, prezime: true, username: true } },
        _count: { select: { reakcije: true, odgovori: true } },
      },
    });

    // Ako je odgovor na postojeći komentar, obaveštavamo autora tog komentara.
    // Ako je top-level komentar, obaveštavamo vlasnika teme. Autor samom sebi
    // ne dobija obaveštenje.
    const primalacId = dto.parentId
      ? (await this.prisma.porukaForuma.findUnique({
          where: { id: dto.parentId },
          select: { autorId: true },
        }))?.autorId
      : tema.farmerId;

    if (primalacId && primalacId !== korisnikId) {
      await this.obavestenjeService.kreiraj({
        korisnikId: primalacId,
        tip: 'ODGOVOR_NA_FORUM',
        poruka: dto.parentId
          ? `${poruka.autor.username} je odgovorio na vaš komentar na forumu.`
          : `${poruka.autor.username} je odgovorio na vašu temu na forumu.`,
        temaId: tema.id,
        porukaId: poruka.id,
      });
    }

    return poruka;
  }

  findAllZaTemu(temaId: number) {
    return this.prisma.porukaForuma.findMany({
      where: { temaId },
      include: {
        autor: { select: { id: true, ime: true, prezime: true, username: true } },
        _count: { select: { reakcije: true, odgovori: true } },
      },
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

  async promeniReakciju(id: number, korisnikId: number) {
    const poruka = await this.prisma.porukaForuma.findUnique({ where: { id } });
    if (!poruka) throw new NotFoundException('Poruka ne postoji');

    const postojeca = await this.prisma.reakcijaNaPoruku.findUnique({
      where: { idMessage_idFarmera: { idMessage: id, idFarmera: korisnikId } },
    });

    if (postojeca) {
      await this.prisma.reakcijaNaPoruku.delete({ where: { id: postojeca.id } });
    } else {
      await this.prisma.reakcijaNaPoruku.create({
        data: { idMessage: id, idFarmera: korisnikId },
      });
    }

    const brojReakcija = await this.prisma.reakcijaNaPoruku.count({ where: { idMessage: id } });
    return { brojReakcija, reagovao: !postojeca };
  }
}
