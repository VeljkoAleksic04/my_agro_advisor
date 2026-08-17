import {
  PrismaClient,
  JedinicaKarence,
  TipPreparata,
  TipPesticida,
  TipDjubriva,
  Elementi,
  Tezina,
  VrstaBiljke,
  JedinicaPovrsine,
  UlogaKorisnika,
} from '@prisma/client';
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

  // Lista svih preparata (Pesticidi i Đubriva)
  const preparatiData = [
    // --- FUNGICIDI ---
    {
      naziv: 'Cuprablau Z',
      proizvodjac: 'Galenika Fitofarmacija',
      trajanjeKarence: 21,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.PESTICID,
      tipPesticida: TipPesticida.FUNGICID,
      opis: 'Kontaktni fungicid i baktericid na bazi bakra za preventivnu zaštitu.',
      sastojci: [
        { element: Elementi.Cu, kolicina: 350, jedinica: Tezina.G },
      ],
    },
    {
      naziv: 'Bordovska Čorba 100 WP',
      proizvodjac: 'Misa',
      trajanjeKarence: 21,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.PESTICID,
      tipPesticida: TipPesticida.FUNGICID,
      opis: 'Tradicionalni fungicid na bazi bakar-sulfata za voćarstvo i vinogradarstvo.',
      sastojci: [
        { element: Elementi.Cu, kolicina: 200, jedinica: Tezina.G },
        { element: Elementi.SO4, kolicina: 150, jedinica: Tezina.G },
      ],
    },

    // --- INSEKTICIDI ---
    {
      naziv: 'Phostoxin Tablete',
      proizvodjac: 'Detia Degesch',
      trajanjeKarence: 7,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.PESTICID,
      tipPesticida: TipPesticida.INSEKTICID,
      opis: 'Fumigant za suzbijanje štetočina u skladištima žita i brašna.',
      sastojci: [
        { element: Elementi.ALUMINIJUM_FOSFID, kolicina: 560, jedinica: Tezina.G },
      ],
    },
    {
      naziv: 'Chromorel D',
      proizvodjac: 'Chromos Agromehanika',
      trajanjeKarence: 28,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.PESTICID,
      tipPesticida: TipPesticida.INSEKTICID,
      opis: 'Insekticid širokog spektra delovanja za voćarstvo.',
      sastojci: [
        { element: Elementi.ORGANOFOSFATI, kolicina: 500, jedinica: Tezina.G },
        { element: Elementi.XILEN, kolicina: 100, jedinica: Tezina.G },
      ],
    },

    // --- HERBICIDI ---
    {
      naziv: 'Tornado 480',
      proizvodjac: 'Agromarket',
      trajanjeKarence: 35,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.PESTICID,
      tipPesticida: TipPesticida.HERBICID,
      opis: 'Totalni neselektivni herbicid za suzbijanje višegodišnjih korova.',
      sastojci: [
        { element: Elementi.XILEN, kolicina: 200, jedinica: Tezina.G },
        { element: Elementi.TOLUEN, kolicina: 50, jedinica: Tezina.G },
      ],
    },

    // --- ĐUBRIVA: ZEMLJANO ---
    {
      naziv: 'AN 34.4%',
      proizvodjac: 'Elixir Zorka',
      trajanjeKarence: 0,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.DJUBRIVO,
      tipDjubriva: TipDjubriva.ZEMLJANO,
      opis: 'Amonijum-nitratno čvrsto azotno đubrivo za prihranu svih kultura.',
      sastojci: [
        { element: Elementi.NH4NO3, kolicina: 344, jedinica: Tezina.G },
      ],
    },
    {
      naziv: 'Magnezijum Sulfat Granulirani',
      proizvodjac: 'HIP-Azotara',
      trajanjeKarence: 0,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.DJUBRIVO,
      tipDjubriva: TipDjubriva.ZEMLJANO,
      opis: 'Zemljano đubrivo za korekciju nedostatka magnezijuma i sumpora.',
      sastojci: [
        { element: Elementi.Mg, kolicina: 160, jedinica: Tezina.G },
        { element: Elementi.SO4, kolicina: 320, jedinica: Tezina.G },
      ],
    },

    // --- ĐUBRIVA: FOLIJALNO ---
    {
      naziv: 'Wuxal Calcium',
      proizvodjac: 'Agromarket',
      trajanjeKarence: 0,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.DJUBRIVO,
      tipDjubriva: TipDjubriva.FOLIJALNO,
      opis: 'Tečno folijarno đubrivo sa visokim sadržajem kalcijuma i magnezijuma.',
      sastojci: [
        { element: Elementi.Ca, kolicina: 160, jedinica: Tezina.G },
        { element: Elementi.Mg, kolicina: 20, jedinica: Tezina.G },
      ],
    },
    {
      naziv: 'Epsotop',
      proizvodjac: 'K+S',
      trajanjeKarence: 0,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.DJUBRIVO,
      tipDjubriva: TipDjubriva.FOLIJALNO,
      opis: 'Vodorastvorljivo folijarno đubrivo bogato magnezijumom i sumporom.',
      sastojci: [
        { element: Elementi.Mg, kolicina: 160, jedinica: Tezina.G },
        { element: Elementi.S, kolicina: 130, jedinica: Tezina.G },
      ],
    },

    // --- ĐUBRIVA: FERTILIGACIONO ---
    {
      naziv: 'PeKacid 0-60-20',
      proizvodjac: 'ICL Fertilizers',
      trajanjeKarence: 0,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.DJUBRIVO,
      tipDjubriva: TipDjubriva.FERTILIGACIONO,
      opis: 'Fosforno fertirigaciono đubrivo koje zakiseljava vodu i čisti kap-po-kap sisteme.',
      sastojci: [
        { element: Elementi.FOSFORNA_KISELINA, kolicina: 850, jedinica: Tezina.G },
      ],
    },
    {
      naziv: 'CitroFert',
      proizvodjac: 'Yara',
      trajanjeKarence: 0,
      jedinicaKarence: JedinicaKarence.DAN,
      tipPreparata: TipPreparata.DJUBRIVO,
      tipDjubriva: TipDjubriva.FERTILIGACIONO,
      opis: 'Organski pufre za fertirigaciju i stimulaciju usvajanja mikroelemenata.',
      sastojci: [
        { element: Elementi.LIMUNSKA_KISELINA, kolicina: 990, jedinica: Tezina.G },
      ],
    },
  ];

  const kreiraniPreparati = [];

  for (const prep of preparatiData) {
    const { sastojci, ...restData } = prep;
    const kreiranPrep = await prisma.preparat.create({
      data: {
        ...restData,
        sastojci: {
          create: sastojci,
        },
      },
    });
    kreiraniPreparati.push(kreiranPrep);
  }

  // Izbor referenci za biljku i tretman
  const preporučenoDjubrivo = kreiraniPreparati.find(
    (p) => p.naziv === 'Wuxal Calcium',
  )!;
  const primenjeniPesticid = kreiraniPreparati.find(
    (p) => p.naziv === 'Cuprablau Z',
  )!;

  // Biljka vise nema unique(parcelaId, vrsta) na nivou baze (posle berbe se
  // biljka trajno brise pa bi upsert po tom kljucu mogao da "pogodi" pogresan
  // - vec obrisan/nepostojeci - red). Zato radimo findFirst pa create/update.
  let biljka = await prisma.biljka.findFirst({
    where: { parcelaId: parcela.id, vrsta: VrstaBiljke.PAPRIKA },
  });
  const podaciBiljke = {
    naziv: 'Paprika Babura',
    vrsta: VrstaBiljke.PAPRIKA,
    pocetakSadnje: new Date('2026-04-01'),
    krajSadnje: new Date('2026-04-20'),
    pocetakBerbe: new Date('2026-07-15'),
    krajBerbe: new Date('2026-09-30'),
    preporucenaTemperaturaC: 24,
    parcelaId: parcela.id,
    preporucenoDjubrivoId: preporučenoDjubrivo.id,
  };
  biljka = biljka
    ? await prisma.biljka.update({ where: { id: biljka.id }, data: podaciBiljke })
    : await prisma.biljka.create({ data: podaciBiljke });

  await prisma.tretman.create({
    data: {
      parcelaId: parcela.id,
      biljkaId: biljka.id,
      preparatId: primenjeniPesticid.id,
      doza: '2.5g/l vode',
    },
  });

  // Sadnja sada zahteva snapshot naziva/vrste kulture (nazivKulture,
  // vrstaKulture) - kopiraju se sa upravo kreirane/azurirane biljke, jer
  // biljkaId postaje null cim se biljka obrise pri berbi.
  await prisma.sadnja.create({
    data: {
      farmerId: farmer.id,
      parcelaId: parcela.id,
      biljkaId: biljka.id,
      nazivKulture: biljka.naziv,
      vrstaKulture: biljka.vrsta,
      kolicinaPosadjeneKulture: 200,
      ocekivaniDatumBerbe: biljka.pocetakBerbe,
    },
  });

  await prisma.navodnjavanje.create({
    data: {
      farmerId: farmer.id,
      parcelaId: parcela.id,
      napomena: 'Kap po kap sistem, 30 min',
    },
  });

  console.log('Seed zavrsen. Ubačeno je 11 preparata sa sastojcima.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
