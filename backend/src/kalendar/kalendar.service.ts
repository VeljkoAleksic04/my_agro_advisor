import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKalendarDogadjajDto } from './dto/create-kalendar-dogadjaj.dto';

export interface KalendarDogadjajRed {
  id: number;
  farmerId: number;
  naslov: string;
  opis: string | null;
  datumPocetka: Date;
  datumKraja: Date;
  kreiranDana: Date;
}

@Injectable()
export class KalendarService {
  constructor(private readonly prisma: PrismaService) {}

  findAllZaKorisnika(farmerId: number) {
    // Raw SQL je nameran: projekat u repozitorijumu sadrži generisani Prisma
    // klijent, a ovaj novi model se dodaje migracijom. Tako backend može da se
    // izgradi i pre sledećeg `prisma generate` koraka, bez zavisnosti od
    // trenutnog TypeScript tipa generisanog klijenta.
    return this.prisma.$queryRaw<KalendarDogadjajRed[]>(Prisma.sql`
      SELECT
        "id",
        "farmerId",
        "naslov",
        "opis",
        "datumPocetka",
        "datumKraja",
        "kreiranDana"
      FROM "kalendar_dogadjaji"
      WHERE "farmerId" = ${farmerId}
      ORDER BY "datumPocetka" ASC, "id" ASC
    `);
  }

  async create(farmerId: number, dto: CreateKalendarDogadjajDto) {
    const datumPocetka = dto.datumPocetka.slice(0, 10);
    const datumKraja = (dto.datumKraja ?? dto.datumPocetka).slice(0, 10);

    if (datumKraja < datumPocetka) {
      throw new BadRequestException('Datum završetka ne može biti pre datuma početka.');
    }

    const rezultat = await this.prisma.$queryRaw<KalendarDogadjajRed[]>(Prisma.sql`
      INSERT INTO "kalendar_dogadjaji"
        ("farmerId", "naslov", "opis", "datumPocetka", "datumKraja")
      VALUES
        (${farmerId}, ${dto.naslov}, ${dto.opis ?? null}, ${datumPocetka}::date, ${datumKraja}::date)
      RETURNING
        "id",
        "farmerId",
        "naslov",
        "opis",
        "datumPocetka",
        "datumKraja",
        "kreiranDana"
    `);

    return rezultat[0];
  }
}
