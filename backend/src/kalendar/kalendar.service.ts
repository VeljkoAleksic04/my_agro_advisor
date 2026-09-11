import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKalendarDogadjajDto } from './dto/create-kalendar-dogadjaj.dto';
import { UpdateKalendarDogadjajDto } from './dto/update-kalendar-dogadjaj.dto';
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
    return this.prisma.$queryRaw<KalendarDogadjajRed[]>(Prisma.sql`
      SELECT "id", "farmerId", "naslov", "opis", "datumPocetka", "datumKraja", "kreiranDana"
      FROM "kalendar_dogadjaji"
      WHERE "farmerId" = ${farmerId}
      ORDER BY "datumPocetka" ASC, "id" ASC
    `);
  }

  async create(farmerId: number, dto: CreateKalendarDogadjajDto) {
    const datumPocetka = dto.datumPocetka.slice(0, 10);
    const datumKraja = (dto.datumKraja ?? dto.datumPocetka).slice(0, 10);
    this.proveriDatume(datumPocetka, datumKraja);

    const rezultat = await this.prisma.$queryRaw<KalendarDogadjajRed[]>(Prisma.sql`
      INSERT INTO "kalendar_dogadjaji"
        ("farmerId", "naslov", "opis", "datumPocetka", "datumKraja")
      VALUES
        (${farmerId}, ${dto.naslov}, ${dto.opis ?? null}, ${datumPocetka}::date, ${datumKraja}::date)
      RETURNING "id", "farmerId", "naslov", "opis", "datumPocetka", "datumKraja", "kreiranDana"
    `);
    return rezultat[0];
  }

  async update(farmerId: number, id: number, dto: UpdateKalendarDogadjajDto) {
    const postojece = await this.prisma.$queryRaw<KalendarDogadjajRed[]>(Prisma.sql`
      SELECT "id", "farmerId", "naslov", "opis", "datumPocetka", "datumKraja", "kreiranDana"
      FROM "kalendar_dogadjaji"
      WHERE "id" = ${id} AND "farmerId" = ${farmerId}
      LIMIT 1
    `);
    if (!postojece[0]) throw new NotFoundException('Događaj nije pronađen.');

    const datumPocetka = dto.datumPocetka?.slice(0, 10) ?? this.datumZaSql(postojece[0].datumPocetka);
    const datumKraja = dto.datumKraja?.slice(0, 10) ?? this.datumZaSql(postojece[0].datumKraja);
    this.proveriDatume(datumPocetka, datumKraja);

    const rezultat = await this.prisma.$queryRaw<KalendarDogadjajRed[]>(Prisma.sql`
      UPDATE "kalendar_dogadjaji"
      SET
        "naslov" = COALESCE(${dto.naslov ?? null}, "naslov"),
        "opis" = CASE WHEN ${dto.opis !== undefined} THEN ${dto.opis || null} ELSE "opis" END,
        "datumPocetka" = ${datumPocetka}::date,
        "datumKraja" = ${datumKraja}::date
      WHERE "id" = ${id} AND "farmerId" = ${farmerId}
      RETURNING "id", "farmerId", "naslov", "opis", "datumPocetka", "datumKraja", "kreiranDana"
    `);
    return rezultat[0];
  }

  async remove(farmerId: number, id: number) {
    const rezultat = await this.prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
      DELETE FROM "kalendar_dogadjaji"
      WHERE "id" = ${id} AND "farmerId" = ${farmerId}
      RETURNING "id"
    `);
    if (!rezultat[0]) throw new NotFoundException('Događaj nije pronađen.');
    return { poruka: 'Događaj je obrisan.' };
  }

  private proveriDatume(pocetak: string, kraj: string) {
    if (kraj < pocetak) throw new BadRequestException('Datum završetka ne može biti pre datuma početka.');
  }

  private datumZaSql(datum: Date): string {
    return datum.toISOString().slice(0, 10);
  }
}
