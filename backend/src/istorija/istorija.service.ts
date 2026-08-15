import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipPreparata } from '@prisma/client';

/** Jedan red u tabeli "Evidencija tretmana" — objedinjuje Tretman i Navodnjavanje u zajednički prikaz. */
export interface StavkaAktivnosti {
  id: string;
  datum: Date;
  tip: 'Đubrenje' | 'Prskanje' | 'Navodnjavanje';
  sredstvo: string;
  kolicina: string;
  status: 'Zakazano' | 'Završeno';
  detalji: {
    tipSredstva: string;
    sredstvo: string;
    kolicina: string;
    metod: string;
    potvrdio: string;
  };
}

@Injectable()
export class IstorijaService {
  constructor(private readonly prisma: PrismaService) {}

  async pregledZaKorisnika(vlasnikId: number, godina?: number) {
    const parcele = await this.prisma.parcela.findMany({
      where: { vlasnikId },
      orderBy: { naziv: 'asc' },
      include: {
        vlasnik: { select: { username: true } },
        sadnje: { include: { biljka: true }, orderBy: { datum: 'desc' } },
        tretmani: { include: { preparat: true }, orderBy: { datumTretmana: 'desc' } },
        navodnjavanja: { orderBy: { datumNavodnjavanja: 'desc' } },
      },
    });

    return parcele.map((parcela) => {
      const potvrdio = parcela.vlasnik.username;

      // Skup svih godina u kojima postoji bar jedan zapis (sadnja/tretman/navodnjavanje) —
      // koristi se na frontu za popunjavanje padajuće liste "Izaberi godinu".
      const godineSaZapisima = new Set<number>([
        ...parcela.sadnje.map((s) => s.datum.getFullYear()),
        ...parcela.tretmani.map((t) => t.datumTretmana.getFullYear()),
        ...parcela.navodnjavanja.map((n) => n.datumNavodnjavanja.getFullYear()),
      ]);

      const filtrirajGodinom = (datum: Date) => !godina || datum.getFullYear() === godina;

      const sadnjeUGodini = parcela.sadnje.filter((s) => filtrirajGodinom(s.datum));

      const aktivnosti: StavkaAktivnosti[] = [
        ...parcela.tretmani
          .filter((t) => filtrirajGodinom(t.datumTretmana))
          .map((t) => this.tretmanUAktivnost(t, potvrdio)),
        ...parcela.navodnjavanja
          .filter((n) => filtrirajGodinom(n.datumNavodnjavanja))
          .map((n) => this.navodnjavanjeUAktivnost(n, potvrdio)),
      ].sort((a, b) => b.datum.getTime() - a.datum.getTime());

      const prinosUkupno = sadnjeUGodini.reduce((zbir, s) => zbir + s.prinos, 0);
      const povrsinaHa = this.uHektarima(parcela.povrsina, parcela.jedinicaMere);
      const prinosPoHa = povrsinaHa > 0 ? Math.round((prinosUkupno / povrsinaHa) * 100) / 100 : 0;

      // Kultura koja se prikazuje u zaglavlju kartice: najskorija sadnja u izabranoj godini,
      // a ako je nema, najskorija sadnja na parceli uopšte.
      const vodecaBiljka = (sadnjeUGodini[0] ?? parcela.sadnje[0])?.biljka ?? null;

      return {
        id: parcela.id,
        naziv: parcela.naziv,
        povrsina: parcela.povrsina,
        jedinicaMere: parcela.jedinicaMere,
        godina: godina ?? null,
        godineSaZapisima: [...godineSaZapisima].sort((a, b) => b - a),
        kultura: vodecaBiljka ? { naziv: vodecaBiljka.naziv, vrsta: vodecaBiljka.vrsta } : null,
        prinosUkupno,
        prinosPoHa,
        jedinicaPrinosa: sadnjeUGodini[0]?.jedinica ?? 'KG',
        aktivnosti,
      };
    });
  }

  private uHektarima(povrsina: number, jedinica: string): number {
    switch (jedinica) {
      case 'HA':
        return povrsina;
      case 'A':
        return povrsina / 100;
      case 'M2':
        return povrsina / 10000;
      default:
        return povrsina;
    }
  }

  private tretmanUAktivnost(
    tretman: { id: number; datumTretmana: Date; doza: string; preparat: { naziv: string; proizvodjac: string; tipPreparata: TipPreparata } },
    potvrdio: string,
  ): StavkaAktivnosti {
    const jeDjubrivo = tretman.preparat.tipPreparata === TipPreparata.DJUBRIVO;
    return {
      id: `tretman-${tretman.id}`,
      datum: tretman.datumTretmana,
      tip: jeDjubrivo ? 'Đubrenje' : 'Prskanje',
      sredstvo: `${tretman.preparat.naziv} (${tretman.doza})`,
      kolicina: tretman.doza,
      status: tretman.datumTretmana <= new Date() ? 'Završeno' : 'Zakazano',
      detalji: {
        tipSredstva: jeDjubrivo ? 'Đubrivo' : 'Pesticid',
        sredstvo: `${tretman.preparat.naziv} (${tretman.preparat.proizvodjac})`,
        kolicina: tretman.doza,
        metod: jeDjubrivo ? 'Rasipanje po parceli' : 'Prskalica',
        potvrdio,
      },
    };
  }

  private navodnjavanjeUAktivnost(
    navodnjavanje: { id: number; datumNavodnjavanja: Date; napomena: string },
    potvrdio: string,
  ): StavkaAktivnosti {
    return {
      id: `navodnjavanje-${navodnjavanje.id}`,
      datum: navodnjavanje.datumNavodnjavanja,
      tip: 'Navodnjavanje',
      sredstvo: navodnjavanje.napomena || 'Voda',
      kolicina: navodnjavanje.napomena || '—',
      status: navodnjavanje.datumNavodnjavanja <= new Date() ? 'Završeno' : 'Zakazano',
      detalji: {
        tipSredstva: 'Navodnjavanje',
        sredstvo: navodnjavanje.napomena || 'Voda',
        kolicina: navodnjavanje.napomena || '—',
        metod: 'Sistem za navodnjavanje',
        potvrdio,
      },
    };
  }
}
