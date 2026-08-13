import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StatusBiljke, VrstaBiljke } from '@prisma/client';import { PrismaService } from '../prisma/prisma.service';
import { CreateBiljkaDto } from './dto/create-biljka.dto';
import { UpdateBiljkaDto } from './dto/update-biljka.dto';
import { BiljkaAkcijaTip, IzvrsiAkcijuDto } from './dto/izvrsi-akciju.dto';
import { jeMesecUPeriodu, preporukaZaVrstu } from './periodi.util';

@Injectable()
export class BiljkaService {
  constructor(private readonly prisma: PrismaService) {}

  private async proveriVlasnistvoParcele(parcelaId: number, korisnikId: number) {
    const parcela = await this.prisma.parcela.findUnique({ where: { id: parcelaId } });
    if (!parcela) throw new NotFoundException('Parcela ne postoji');
    if (parcela.vlasnikId !== korisnikId) {
      throw new ForbiddenException('Parcela ne pripada ulogovanom korisniku');
    }
    return parcela;
  }

  private async pronadjiBiljkuIProveriVlasnistvo(id: number, korisnikId: number) {
    const biljka = await this.findOne(id);
    await this.proveriVlasnistvoParcele(biljka.parcelaId, korisnikId);
    return biljka;
  }

  /**
   * Preracunava pocetak/kraj sadnje i berbe iz kataloga (periodi.util) za
   * tekucu godinu, na osnovu vrste. Koristi se pri kreiranju biljke - korisnik
   * ove datume vise ne unosi rucno.
   */
  private izracunajPeriode(vrsta: VrstaBiljke) {
    const preporuka = preporukaZaVrstu(vrsta);
    const godina = new Date().getFullYear();
    const uDatum = (mesecOd: number, mesecDo: number) => {
      const pocetak = new Date(godina, mesecOd - 1, 1);
      const poslednjiDan = new Date(godina, mesecDo, 0).getDate();
      const kraj = new Date(godina, mesecDo - 1, poslednjiDan);
      return { pocetak, kraj };
    };
    const sadnja = uDatum(preporuka.setva[0].mesecOd, preporuka.setva[0].mesecDo);
    const berba = uDatum(preporuka.berba[0].mesecOd, preporuka.berba[0].mesecDo);
    return {
      pocetakSadnje: sadnja.pocetak,
      krajSadnje: sadnja.kraj,
      pocetakBerbe: berba.pocetak,
      krajBerbe: berba.kraj,
    };
  }

  /**
   * Proverava da li na parceli ima dovoljno slobodne povrsine za novu
   * (ili izmenjenu) povrsinu biljke. `izuzmiBiljkuId` se koristi kod
   * update-a da izmenjena biljka ne racuna sopstvenu staru povrsinu dvaput.
   */
  private async proveriSlobodnuPovrsinu(
    parcelaId: number,
    zeljenaPovrsina: number,
    izuzmiBiljkuId?: number,
  ) {
    const parcela = await this.prisma.parcela.findUnique({
      where: { id: parcelaId },
      include: { biljke: true },
    });
    if (!parcela) throw new NotFoundException('Parcela ne postoji');

    const zauzeto = parcela.biljke
      .filter((b) => b.id !== izuzmiBiljkuId)
      .reduce((zbir, b) => zbir + b.povrsina, 0);
    const slobodno = parcela.povrsina - zauzeto;

    if (zeljenaPovrsina > slobodno) {
      throw new ConflictException({
        message: `Nema dovoljno slobodne povrsine na parceli. Slobodno: ${slobodno}, zatrazeno: ${zeljenaPovrsina}.`,
        kod: 'NEDOVOLJNO_POVRSINE',
        slobodnaPovrsina: slobodno,
      });
    }
  }

  async create(korisnikId: number, dto: CreateBiljkaDto) {
    await this.proveriVlasnistvoParcele(dto.parcelaId, korisnikId);
    await this.proveriSlobodnuPovrsinu(dto.parcelaId, dto.povrsina);

    const periodi = this.izracunajPeriode(dto.vrsta);

    try {
      return await this.prisma.biljka.create({
        data: {
          naziv: dto.naziv,
          vrsta: dto.vrsta,
          povrsina: dto.povrsina,
          datumSadnje: new Date(),
          ...periodi,
          preporucenaTemperaturaC: dto.preporucenaTemperaturaC ?? 20,
          parcelaId: dto.parcelaId,
          preporucenoDjubrivoId: dto.preporucenoDjubrivoId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ta vrsta biljke je vec zasadjena na ovoj parceli');
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
    const parcelaId = dto.parcelaId ?? biljka.parcelaId;
    await this.proveriVlasnistvoParcele(parcelaId, korisnikId);

    if (dto.povrsina !== undefined) {
      await this.proveriSlobodnuPovrsinu(parcelaId, dto.povrsina, id);
    }

    try {
      const data: Prisma.BiljkaUpdateInput = {
        naziv: dto.naziv,
        vrsta: dto.vrsta,
        povrsina: dto.povrsina,
        preporucenaTemperaturaC: dto.preporucenaTemperaturaC,
        preporucenoDjubrivoId: dto.preporucenoDjubrivoId,
        ...(dto.parcelaId !== undefined ? { parcela: { connect: { id: dto.parcelaId } } } : {}),
      };
      return await this.prisma.biljka.update({ where: { id }, data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Ta vrsta biljke je vec zasadjena na ovoj parceli');
      }
      throw e;
    }
  }

  async remove(id: number, korisnikId: number) {
    const biljka = await this.findOne(id);
    await this.proveriVlasnistvoParcele(biljka.parcelaId, korisnikId);
    return this.prisma.biljka.delete({ where: { id } });
  }

  preporukaZaVrstu(vrsta: VrstaBiljke) {
    return preporukaZaVrstu(vrsta);
  }

  /**
   * Jedinstvena akcija nad biljkom (OBERI / ZALIJ / TRETIRAJ) - koristi je
   * kartica biljke na front-endu. Za OBERI se proverava da li trenutni
   * datum upada u preporuceni period berbe za tu vrstu; ako ne upada i
   * `forsirajVanPerioda` nije poslato, akcija se NE izvrsava vec se vraca
   * 409 sa informacijom o odstupanju (front-end tada prikazuje modal).
   */
  async izvrsiAkciju(id: number, korisnikId: number, dto: IzvrsiAkcijuDto) {
    const biljka = await this.pronadjiBiljkuIProveriVlasnistvo(id, korisnikId);
    this.proveriDaBiljkaNijeZavrsena(biljka.status, dto.akcija);

    const sada = new Date();
    const preporuka = preporukaZaVrstu(biljka.vrsta);

    if (dto.akcija === 'OBERI') {
      const mesec = sada.getMonth() + 1;
      const uPeriodu = jeMesecUPeriodu(mesec, preporuka.berba);

      if (!uPeriodu && !dto.forsirajVanPerioda) {
        const porukaVanPerioda =
          `Odabrani datum odstupa od preporucenog perioda berbe za ovu vrstu biljke. ${preporuka.opis}`;
        throw new ConflictException({
          message: porukaVanPerioda,
          kod: 'VAN_PERIODA',
          provera: {
            akcija: dto.akcija,
            biljkaId: biljka.id,
            uPeriodu: false,
            trenutniStatus: biljka.status,
            preporuka,
            porukaVanPerioda,
          },
        });
      }

      return this.prisma.biljka.update({
        where: { id: biljka.id },
        data: { status: StatusBiljke.OBRANA, poslednjaBerba: sada },
      });
    }

    if (dto.akcija === 'ZALIJ') {
      return this.prisma.biljka.update({
        where: { id: biljka.id },
        data: {
          poslednjeZalivanje: sada,
          status: biljka.status === StatusBiljke.POSADJENA ? StatusBiljke.RASTE : biljka.status,
        },
      });
    }

    // TRETIRAJ
    return this.prisma.biljka.update({
      where: { id: biljka.id },
      data: {
        poslednjiTretman: sada,
        status: biljka.status === StatusBiljke.POSADJENA ? StatusBiljke.RASTE : biljka.status,
      },
    });
  }

  private proveriDaBiljkaNijeZavrsena(status: StatusBiljke, akcija: BiljkaAkcijaTip) {
    const nazivAkcije = akcija === 'OBERI' ? 'berba' : akcija === 'ZALIJ' ? 'zalivanje' : 'tretiranje';
    if (status === StatusBiljke.OBRANA) {
      throw new ConflictException(`Biljka je vec obrana, ${nazivAkcije} nije moguce`);
    }
    if (status === StatusBiljke.PROPALA) {
      throw new ConflictException(`Biljka je propala, ${nazivAkcije} nije moguce`);
    }
  }
}