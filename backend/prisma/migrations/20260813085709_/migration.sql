-- CreateEnum
CREATE TYPE "JedinicaPovrsine" AS ENUM ('A', 'HA', 'M2');

-- CreateEnum
CREATE TYPE "JedinicaKarence" AS ENUM ('DAN', 'NEDELJA', 'MESEC');

-- CreateEnum
CREATE TYPE "TipPreparata" AS ENUM ('PESTICID', 'DJUBRIVO');

-- CreateEnum
CREATE TYPE "TipPesticida" AS ENUM ('INSEKTICID', 'HERBICID', 'FUNGICID');

-- CreateEnum
CREATE TYPE "TipDjubriva" AS ENUM ('ZEMLJANO', 'FOLIJALNO', 'FERTILIGACIONO');

-- CreateEnum
CREATE TYPE "Tezina" AS ENUM ('mg', 'G', 'KG', 'T');

-- CreateEnum
CREATE TYPE "StatusZasadjeneKulture" AS ENUM ('ZASADJENA', 'AKTIVNA', 'OBRANA', 'PROPALA');

-- CreateEnum
CREATE TYPE "StatusBiljke" AS ENUM ('POSADJENA', 'RASTE', 'OBRANA', 'PROPALA');

-- CreateEnum
CREATE TYPE "UlogaKorisnika" AS ENUM ('GOST', 'FARMER');

-- CreateEnum
CREATE TYPE "StatusPoruke" AS ENUM ('POSLATA', 'PRIMLJENA', 'PROCITANA', 'NEUSPESNO_SLANJE');

-- CreateEnum
CREATE TYPE "Elementi" AS ENUM ('Mg', 'Ca', 'S', 'Cu', 'NH4NO3', 'SO4', 'Cl', 'NATRIJUM_HIPOHLORIT', 'LIMUNSKA_KISELINA', 'FOSFORNA_KISELINA', 'ALUMINIJUM_FOSFID', 'ORGANOFOSFATI', 'XILEN', 'TOLUEN');

-- CreateEnum
CREATE TYPE "VrstaBiljke" AS ENUM ('PSENICA', 'KUKURUZ', 'JECAM', 'OVAS', 'RAZ', 'SUNCOKRET', 'SOJA', 'SECERNA_REPA', 'KROMPIR', 'PARADAJZ', 'PAPRIKA', 'KRASTAVAC', 'KUPUS', 'LUK', 'BELI_LUK', 'SARGAREPA', 'SALATA', 'TIKVICA', 'LUBENICA', 'DINJA');

-- CreateTable
CREATE TABLE "poljoprivrednici" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "datumRodjenja" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "brojTelefona" TEXT,
    "slika" TEXT,
    "kreiranDana" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "izmenjenDana" TIMESTAMP(3) NOT NULL,
    "ukupnoPoena" INTEGER NOT NULL DEFAULT 0,
    "uloga" "UlogaKorisnika" NOT NULL DEFAULT 'GOST',

    CONSTRAINT "poljoprivrednici_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcele" (
    "id" SERIAL NOT NULL,
    "vlasnikId" INTEGER NOT NULL,
    "naziv" TEXT NOT NULL,
    "povrsina" INTEGER NOT NULL,
    "jedinicaMere" "JedinicaPovrsine" NOT NULL DEFAULT 'A',
    "klasa" INTEGER NOT NULL,
    "datumUpisa" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opis" TEXT,

    CONSTRAINT "parcele_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biljke" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "vrsta" "VrstaBiljke" NOT NULL,
    "pocetakSadnje" TIMESTAMP(3) NOT NULL,
    "krajSadnje" TIMESTAMP(3) NOT NULL,
    "pocetakBerbe" TIMESTAMP(3) NOT NULL,
    "krajBerbe" TIMESTAMP(3) NOT NULL,
    "preporucenoDjubrivoId" INTEGER,
    "preporucenaTemperaturaC" INTEGER NOT NULL,
    "povrsina" INTEGER NOT NULL DEFAULT 0,
    "datumSadnje" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusBiljke" NOT NULL DEFAULT 'POSADJENA',
    "poslednjeZalivanje" TIMESTAMP(3),
    "poslednjiTretman" TIMESTAMP(3),
    "poslednjaBerba" TIMESTAMP(3),
    "parcelaId" INTEGER NOT NULL,

    CONSTRAINT "biljke_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tretmani" (
    "id" SERIAL NOT NULL,
    "parcelaId" INTEGER NOT NULL,
    "biljkaId" INTEGER,
    "preparatId" INTEGER NOT NULL,
    "doza" TEXT NOT NULL,
    "datumTretmana" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tretmani_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preparati" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "proizvodjac" TEXT NOT NULL,
    "trajanjeKarence" INTEGER NOT NULL,
    "jedinicaKarence" "JedinicaKarence" NOT NULL,
    "tipPreparata" "TipPreparata" NOT NULL,
    "tipPesticida" "TipPesticida",
    "tipDjubriva" "TipDjubriva",
    "opis" TEXT NOT NULL,

    CONSTRAINT "preparati_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sastojci" (
    "id" SERIAL NOT NULL,
    "preparatId" INTEGER NOT NULL,
    "element" "Elementi" NOT NULL,
    "kolicina" INTEGER NOT NULL,
    "jedinica" "Tezina" NOT NULL DEFAULT 'mg',

    CONSTRAINT "sastojci_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sadnje" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parcelaId" INTEGER NOT NULL,
    "biljkaId" INTEGER NOT NULL,
    "kolicinaPosadjeneKulture" INTEGER NOT NULL,
    "ocekivaniDatumBerbe" TIMESTAMP(3),
    "prinos" INTEGER NOT NULL DEFAULT 0,
    "jedinica" "Tezina" NOT NULL DEFAULT 'KG',
    "status" "StatusZasadjeneKulture" NOT NULL DEFAULT 'ZASADJENA',

    CONSTRAINT "sadnje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transakcije_poena" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "datumTransakcije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ostvareniPoeni" INTEGER NOT NULL,
    "razlog" TEXT NOT NULL,

    CONSTRAINT "transakcije_poena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teme_foruma" (
    "id" SERIAL NOT NULL,
    "naslov" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "datumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datumIzmene" TIMESTAMP(3),
    "farmerId" INTEGER NOT NULL,

    CONSTRAINT "teme_foruma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poruke_foruma" (
    "id" SERIAL NOT NULL,
    "sadrzaj" TEXT NOT NULL,
    "datumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datumIzmene" TIMESTAMP(3),
    "autorId" INTEGER NOT NULL,
    "temaId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "poruke_foruma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navodnjavanja" (
    "id" SERIAL NOT NULL,
    "datumNavodnjavanja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parcelaId" INTEGER,
    "farmerId" INTEGER NOT NULL,
    "napomena" TEXT NOT NULL,

    CONSTRAINT "navodnjavanja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reakcije_na_temu" (
    "id" SERIAL NOT NULL,
    "datumReakcije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idPost" INTEGER NOT NULL,
    "idFarmera" INTEGER NOT NULL,

    CONSTRAINT "reakcije_na_temu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reakcije_na_poruku" (
    "id" SERIAL NOT NULL,
    "datumReakcije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idFarmera" INTEGER NOT NULL,
    "idMessage" INTEGER NOT NULL,

    CONSTRAINT "reakcije_na_poruku_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "poljoprivrednici_email_key" ON "poljoprivrednici"("email");

-- CreateIndex
CREATE UNIQUE INDEX "poljoprivrednici_username_key" ON "poljoprivrednici"("username");

-- CreateIndex
CREATE UNIQUE INDEX "biljke_parcelaId_vrsta_key" ON "biljke"("parcelaId", "vrsta");

-- CreateIndex
CREATE UNIQUE INDEX "tretmani_parcelaId_biljkaId_preparatId_datumTretmana_key" ON "tretmani"("parcelaId", "biljkaId", "preparatId", "datumTretmana");

-- CreateIndex
CREATE UNIQUE INDEX "sastojci_preparatId_element_key" ON "sastojci"("preparatId", "element");

-- CreateIndex
CREATE UNIQUE INDEX "reakcije_na_temu_idPost_idFarmera_key" ON "reakcije_na_temu"("idPost", "idFarmera");

-- CreateIndex
CREATE UNIQUE INDEX "reakcije_na_poruku_idMessage_idFarmera_key" ON "reakcije_na_poruku"("idMessage", "idFarmera");

-- AddForeignKey
ALTER TABLE "parcele" ADD CONSTRAINT "parcele_vlasnikId_fkey" FOREIGN KEY ("vlasnikId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biljke" ADD CONSTRAINT "biljke_preporucenoDjubrivoId_fkey" FOREIGN KEY ("preporucenoDjubrivoId") REFERENCES "preparati"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biljke" ADD CONSTRAINT "biljke_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "parcele"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tretmani" ADD CONSTRAINT "tretmani_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "parcele"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tretmani" ADD CONSTRAINT "tretmani_biljkaId_fkey" FOREIGN KEY ("biljkaId") REFERENCES "biljke"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tretmani" ADD CONSTRAINT "tretmani_preparatId_fkey" FOREIGN KEY ("preparatId") REFERENCES "preparati"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sastojci" ADD CONSTRAINT "sastojci_preparatId_fkey" FOREIGN KEY ("preparatId") REFERENCES "preparati"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sadnje" ADD CONSTRAINT "sadnje_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sadnje" ADD CONSTRAINT "sadnje_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "parcele"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sadnje" ADD CONSTRAINT "sadnje_biljkaId_fkey" FOREIGN KEY ("biljkaId") REFERENCES "biljke"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transakcije_poena" ADD CONSTRAINT "transakcije_poena_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teme_foruma" ADD CONSTRAINT "teme_foruma_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poruke_foruma" ADD CONSTRAINT "poruke_foruma_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poruke_foruma" ADD CONSTRAINT "poruke_foruma_temaId_fkey" FOREIGN KEY ("temaId") REFERENCES "teme_foruma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poruke_foruma" ADD CONSTRAINT "poruke_foruma_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "poruke_foruma"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "navodnjavanja" ADD CONSTRAINT "navodnjavanja_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "parcele"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navodnjavanja" ADD CONSTRAINT "navodnjavanja_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reakcije_na_temu" ADD CONSTRAINT "reakcije_na_temu_idPost_fkey" FOREIGN KEY ("idPost") REFERENCES "teme_foruma"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reakcije_na_temu" ADD CONSTRAINT "reakcije_na_temu_idFarmera_fkey" FOREIGN KEY ("idFarmera") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reakcije_na_poruku" ADD CONSTRAINT "reakcije_na_poruku_idFarmera_fkey" FOREIGN KEY ("idFarmera") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reakcije_na_poruku" ADD CONSTRAINT "reakcije_na_poruku_idMessage_fkey" FOREIGN KEY ("idMessage") REFERENCES "poruke_foruma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
