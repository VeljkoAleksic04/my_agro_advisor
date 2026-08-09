import { PrismaClient, JedinicaKarence, TipPreparata, TipPesticida, TipDjubriva, Elementi, Tezina, VrstaBiljke, JedinicaPovrsine, UlogaKorisnika } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seedujem bazu...');

  const hashLozinke = await bcrypt.hash('lozinka123', 10);

  const farmer = await prisma.poljoprivrednik.upsert({
    where: { username: 'petarpetrovic' },
    update: {},
    create: {
      ime: 'Petar',
      prezime: 'Petrovic',
      email: 'petar.petrovic@example.com',
      datumRodjenja: new Date('1990-05-12'),
      username: 'petarpetrovic',
      password: hashLozinke,
      uloga: UlogaKorisnika.FARMER,
      ukupnoPoena: 0,
    },
  });

  const parcela = await prisma.parcela.upsert({
    where: { id: 1 },
    update: {},
    create: {
      vlasnikId: farmer.id,
      naziv: 'Njiva kod reke',
      povrsina: 50,
      jedinicaMere: JedinicaPovrsine.A,
      klasa: 2,
    },
  });

  const djubrivo = await prisma.preparat.create({
    data: {
      naziv: 'Folifert NPK',
      proizvodjac: 'AgroHem',
      trajanjeKarence: 7,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.DJUBRIVO,
      tipDjubriva: TipDjubriva.FOLIJALNO,
      opis: 'Folijalno djubrivo za povrce',
      sastojci: {
        create: [
          { element: Elementi.Mg, kolicina: 50, jedinica: Tezina.G },
          { element: Elementi.Ca, kolicina: 30, jedinica: Tezina.G },
        ],
      },
    },
  });

  const pesticid = await prisma.preparat.create({
    data: {
      naziv: 'Zastit 2000',
      proizvodjac: 'Galenika Fitofarmacija',
      trajanjeKarence: 14,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.PESTICID,
      tipPesticida: TipPesticida.FUNGICID,
      opis: 'Fungicid protiv plamenjace',
      sastojci: {
        create: [{ element: Elementi.Cu, kolicina: 200, jedinica: Tezina.G }],
      },
    },
  });

  const biljka = await prisma.biljka.upsert({
    where: { parcelaId_vrsta: { parcelaId: parcela.id, vrsta: VrstaBiljke.PAPRIKA } },
    update: {},
    create: {
      naziv: 'Paprika Babura',
      vrsta: VrstaBiljke.PAPRIKA,
      pocetakSadnje: new Date('2026-04-01'),
      krajSadnje: new Date('2026-04-20'),
      pocetakBerbe: new Date('2026-07-15'),
      krajBerbe: new Date('2026-09-30'),
      preporucenaTemperaturaC: 24,
      parcelaId: parcela.id,
      preporucenoDjubrivoId: djubrivo.id,
    },
  });

  await prisma.tretman.create({
    data: {
      parcelaId: parcela.id,
      biljkaId: biljka.id,
      preparatId: pesticid.id,
      doza: '2ml/l vode',
    },
  });

  await prisma.sadnja.create({
    data: {
      farmerId: farmer.id,
      parcelaId: parcela.id,
      biljkaId: biljka.id,
      kolicinaPosadjeneKulture: 300,
      ocekivaniDatumBerbe: new Date('2026-07-20'),
    },
  });

  await prisma.navodnjavanje.create({
    data: {
      farmerId: farmer.id,
      parcelaId: parcela.id,
      napomena: 'Kap po kap sistem, 30 min',
    },
  });

  console.log('Seed zavrsen. Korisnik: petarpetrovic / lozinka123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
