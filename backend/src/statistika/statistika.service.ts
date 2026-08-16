import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusZasadjeneKulture, VrstaBiljke } from '@prisma/client';

export interface StatistikaFilter {
  godina?: number;
  vrsta?: VrstaBiljke;
  parcelaId?: number;
}

/** Konverzija u tone radi prikaza (Sadnja.prinos se cuva u kg). */
const KG_PO_TONI = 1000;

@Injectable()
export class StatistikaService {
  constructor(private readonly prisma: PrismaService) {}

  async pregled(korisnikId: number, filter: StatistikaFilter) {
    const parcele = await this.prisma.parcela.findMany({
      where: { vlasnikId: korisnikId, ...(filter.parcelaId ? { id: filter.parcelaId } : {}) },
      include: {
        sadnje: { where: { status: StatusZasadjeneKulture.OBRANA } },
        tretmani: true,
      },
    });

    // Jedna "tacka" = jedan obrani ciklus (sadnja) na jednoj parceli u jednoj
    // godini, sa brojem tretmana evidentiranih na toj parceli te iste godine.
    // Ovo je osnovna jedinica za scatter/bar grafikone i sve KPI kartice.
    interface Tacka {
      parcelaId: number;
      parcelaNaziv: string;
      godina: number;
      prinosKg: number;
      brojTretmana: number;
    }

    const tacke: Tacka[] = [];
    const sveGodine = new Set<number>();

    for (const parcela of parcele) {
      for (const sadnja of parcela.sadnje) {
        if (filter.vrsta && sadnja.vrstaKulture !== filter.vrsta) continue;

        const godina = sadnja.datum.getFullYear();
        sveGodine.add(godina);
        if (filter.godina && godina !== filter.godina) continue;

        const prinosKg = sadnja.jedinica === 'T' ? sadnja.prinos * KG_PO_TONI : sadnja.prinos;
        const brojTretmana = parcela.tretmani.filter(
          (t) => t.datumTretmana.getFullYear() === godina,
        ).length;

        tacke.push({
          parcelaId: parcela.id,
          parcelaNaziv: parcela.naziv,
          godina,
          prinosKg,
          brojTretmana,
        });
      }
    }

    const ukupanPrinosKg = tacke.reduce((zbir, t) => zbir + t.prinosKg, 0);
    const ukupanBrojTretmana = tacke.reduce((zbir, t) => zbir + t.brojTretmana, 0);
    const prosecanBrojTretmana = tacke.length > 0 ? ukupanBrojTretmana / tacke.length : 0;
    const prosecanPrinosPoTretmanuKg = ukupanBrojTretmana > 0 ? ukupanPrinosKg / ukupanBrojTretmana : 0;

    // Najproduktivnija parcela: najveci prinos po hektaru medju obuhvacenim tackama.
    const zbirPoParceli = new Map<number, { naziv: string; prinosKg: number; povrsinaHa: number }>();
    for (const parcela of parcele) {
      zbirPoParceli.set(parcela.id, {
        naziv: parcela.naziv,
        prinosKg: 0,
        povrsinaHa: this.uHektarima(parcela.povrsina, parcela.jedinicaMere),
      });
    }
    for (const t of tacke) {
      const zapis = zbirPoParceli.get(t.parcelaId);
      if (zapis) zapis.prinosKg += t.prinosKg;
    }

    let najproduktivnijaParcela: { id: number; naziv: string; prinosPoHaKg: number } | null = null;
    for (const [id, zapis] of zbirPoParceli) {
      if (zapis.prinosKg === 0 || zapis.povrsinaHa <= 0) continue;
      const prinosPoHaKg = zapis.prinosKg / zapis.povrsinaHa;
      if (!najproduktivnijaParcela || prinosPoHaKg > najproduktivnijaParcela.prinosPoHaKg) {
        najproduktivnijaParcela = { id, naziv: zapis.naziv, prinosPoHaKg };
      }
    }

    // Poredjenje parcela: prosecan prinos (u tonama) po parceli, preko svih
    // obuhvacenih godina - za bar grafikon.
    const grupePoParceli = new Map<number, { naziv: string; prinosiKg: number[] }>();
    for (const t of tacke) {
      const grupa = grupePoParceli.get(t.parcelaId) ?? { naziv: t.parcelaNaziv, prinosiKg: [] };
      grupa.prinosiKg.push(t.prinosKg);
      grupePoParceli.set(t.parcelaId, grupa);
    }
    const barPoParceli = [...grupePoParceli.entries()].map(([id, grupa]) => ({
      parcelaId: id,
      parcelaNaziv: grupa.naziv,
      prosecanPrinosT: this.zaokruzi(
        grupa.prinosiKg.reduce((a, b) => a + b, 0) / grupa.prinosiKg.length / KG_PO_TONI,
      ),
    }));

    // Procena troska tretmana: gruba heuristika na osnovu prosecnog broja
    // tretmana po ciklusu (nema stvarnih cena tretmana u modelu podataka).
    const indeksPct = Math.min(100, Math.round((prosecanBrojTretmana / 6) * 100));
    const nivo: 'Nizak' | 'Srednji' | 'Visok' =
      prosecanBrojTretmana <= 2 ? 'Nizak' : prosecanBrojTretmana <= 4 ? 'Srednji' : 'Visok';

    return {
      dostupneGodine: [...sveGodine].sort((a, b) => b - a),
      kpi: {
        ukupanPrinosT: this.zaokruzi(ukupanPrinosKg / KG_PO_TONI),
        najproduktivnijaParcela: najproduktivnijaParcela
          ? {
              id: najproduktivnijaParcela.id,
              naziv: najproduktivnijaParcela.naziv,
              prinosPoHaKg: this.zaokruzi(najproduktivnijaParcela.prinosPoHaKg),
            }
          : null,
        prosecanPrinosPoTretmanuT: this.zaokruzi(prosecanPrinosPoTretmanuKg / KG_PO_TONI, 3),
        prosecanBrojTretmana: this.zaokruzi(prosecanBrojTretmana, 1),
        troskoTretmana: { nivo, indeksPct },
      },
      scatter: tacke.map((t) => ({
        parcelaId: t.parcelaId,
        parcelaNaziv: t.parcelaNaziv,
        brojTretmana: t.brojTretmana,
        prinosT: this.zaokruzi(t.prinosKg / KG_PO_TONI, 2),
      })),
      barPoParceli,
    };
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

  private zaokruzi(vrednost: number, decimale = 2): number {
    const faktor = 10 ** decimale;
    return Math.round(vrednost * faktor) / faktor;
  }
}
