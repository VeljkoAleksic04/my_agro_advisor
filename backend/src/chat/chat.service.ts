import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface ChatKorisnik {
  id: number;
  username: string;
  ime: string;
  prezime: string;
  slika: string | null;
}

export interface ChatPoruka {
  id: number;
  posiljalacId: number;
  primalacId: number;
  sadrzaj: string;
  datumSlanja: Date;
  procitano: boolean;
}

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async korisnici(trenutniId: number): Promise<ChatKorisnik[]> {
    return this.prisma.$queryRaw<ChatKorisnik[]>(Prisma.sql`
      SELECT CASE WHEN "korisnik1Id" = ${trenutniId} THEN p2."id" ELSE p1."id" END AS "id",
             CASE WHEN "korisnik1Id" = ${trenutniId} THEN p2."username" ELSE p1."username" END AS "username",
             CASE WHEN "korisnik1Id" = ${trenutniId} THEN p2."ime" ELSE p1."ime" END AS "ime",
             CASE WHEN "korisnik1Id" = ${trenutniId} THEN p2."prezime" ELSE p1."prezime" END AS "prezime",
             CASE WHEN "korisnik1Id" = ${trenutniId} THEN p2."slika" ELSE p1."slika" END AS "slika"
      FROM "chat_kontakti" c
      JOIN "poljoprivrednici" p1 ON p1."id" = c."korisnik1Id"
      JOIN "poljoprivrednici" p2 ON p2."id" = c."korisnik2Id"
      WHERE c."korisnik1Id" = ${trenutniId} OR c."korisnik2Id" = ${trenutniId}
      ORDER BY "username" ASC
    `);
  }

  async zapocniKontakt(trenutniId: number, drugiId: number) {
    await this.proveriKorisnika(drugiId);
    if (trenutniId === drugiId) throw new BadRequestException('Nije moguće kontaktirati samog sebe.');
    const [a, b] = [Math.min(trenutniId, drugiId), Math.max(trenutniId, drugiId)];
    await this.prisma.$executeRaw(Prisma.sql`
      INSERT INTO "chat_kontakti" ("korisnik1Id", "korisnik2Id") VALUES (${a}, ${b})
      ON CONFLICT ("korisnik1Id", "korisnik2Id") DO NOTHING
    `);
    return { uspesno: true };
  }

  async brojNeprocitanih(korisnikId: number): Promise<number> {
    const rezultat = await this.prisma.$queryRaw<{ broj: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS broj FROM "chat_poruke" WHERE "primalacId" = ${korisnikId} AND "procitano" = false
    `);
    return Number(rezultat[0]?.broj ?? 0);
  }

  async poruke(trenutniId: number, drugiId: number): Promise<ChatPoruka[]> {
    await this.proveriKorisnika(drugiId);
    return this.prisma.$queryRaw<ChatPoruka[]>(Prisma.sql`
      SELECT "id", "posiljalacId", "primalacId", "sadrzaj", "datumSlanja", "procitano"
      FROM "chat_poruke"
      WHERE ("posiljalacId" = ${trenutniId} AND "primalacId" = ${drugiId})
         OR ("posiljalacId" = ${drugiId} AND "primalacId" = ${trenutniId})
      ORDER BY "datumSlanja" ASC, "id" ASC
    `);
  }

  async posalji(posiljalacId: number, primalacId: number, sadrzaj: string): Promise<ChatPoruka> {
    if (posiljalacId === primalacId) throw new BadRequestException('Nije moguće poslati poruku samom sebi.');
    await this.proveriKorisnika(primalacId);

    const tekst = sadrzaj.trim();
    if (!tekst) throw new BadRequestException('Poruka ne može biti prazna.');
    if (tekst.length > 2000) throw new BadRequestException('Poruka je predugačka.');

    const rezultat = await this.prisma.$queryRaw<ChatPoruka[]>(Prisma.sql`
      INSERT INTO "chat_poruke" ("posiljalacId", "primalacId", "sadrzaj")
      VALUES (${posiljalacId}, ${primalacId}, ${tekst})
      RETURNING "id", "posiljalacId", "primalacId", "sadrzaj", "datumSlanja", "procitano"
    `);
    return rezultat[0];
  }

  async oznaciProcitano(trenutniId: number, drugiId: number) {
    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE "chat_poruke"
      SET "procitano" = true
      WHERE "posiljalacId" = ${drugiId} AND "primalacId" = ${trenutniId}
    `);
  }

  private async proveriKorisnika(id: number) {
    const rezultat = await this.prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
      SELECT "id" FROM "poljoprivrednici" WHERE "id" = ${id} LIMIT 1
    `);
    if (!rezultat[0]) throw new NotFoundException('Korisnik ne postoji.');
  }
}
