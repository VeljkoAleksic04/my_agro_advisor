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
CREATE TYPE "UlogaKorisnika" AS ENUM ('GOST', 'FARMER');

-- CreateEnum
CREATE TYPE "StatusPoruke" AS ENUM ('POSLATA', 'PRIMLJENA', 'PROCITANA', 'NEUSPESNO_SLANJE');

-- CreateEnum
CREATE TYPE "Elementi" AS ENUM ('Mg', 'Ca', 'S', 'Cu', 'NH4NO3', 'SO4', 'Cl', 'Natrijum_hipohlorih', 'Limunska_kiselina', 'Fosforna_kiselina', 'Aluminijum_fosfid', 'Organofosfati', 'Xilen', 'Toulen');

-- CreateTable
CREATE TABLE "Poljoprivrednik" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "orezime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "datumRodjenja" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "kreiranDana" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "izmenjenDana" TIMESTAMP(3) NOT NULL,
    "ukupnoPoena" INTEGER NOT NULL,
    "uloga" "UlogaKorisnika" NOT NULL DEFAULT 'GOST',

    CONSTRAINT "Poljoprivrednik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcela" (
    "id" SERIAL NOT NULL,
    "vlasnikId" INTEGER NOT NULL,
    "naziv" TEXT NOT NULL,
    "povrsina" INTEGER NOT NULL,
    "jedinicaMere" "JedinicaPovrsine" NOT NULL DEFAULT 'A',
    "klasa" INTEGER NOT NULL,
    "datumUpisa" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parcela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biljka" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "vrsta" TEXT NOT NULL,
    "pocetakSadnje" TIMESTAMP(3) NOT NULL,
    "krajSadnje" TIMESTAMP(3) NOT NULL,
    "pocetakBerbe" TIMESTAMP(3) NOT NULL,
    "krajBerbe" TIMESTAMP(3) NOT NULL,
    "preporucenoDjubrivoId" INTEGER NOT NULL,
    "preporicenaTemperaturaC" INTEGER NOT NULL,
    "parcelaId" INTEGER NOT NULL,

    CONSTRAINT "Biljka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tretman" (
    "id" SERIAL NOT NULL,
    "parcelaId" INTEGER NOT NULL,
    "biljkaId" INTEGER,
    "preparatId" INTEGER NOT NULL,
    "doza" TEXT NOT NULL,
    "datumTretmana" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tretman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preparat" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "proizvodjac" TEXT NOT NULL,
    "trajanjeKarence" INTEGER NOT NULL,
    "jedinicaKarence" "JedinicaKarence" NOT NULL,
    "tipPreparata" "TipPreparata" NOT NULL,
    "tipPesticida" "TipPesticida",
    "tipDjubriva" "TipDjubriva",
    "opis" TEXT NOT NULL,

    CONSTRAINT "Preparat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sastojak" (
    "id" SERIAL NOT NULL,
    "preparatId" INTEGER NOT NULL,
    "elementId" INTEGER NOT NULL,
    "kolicina" INTEGER NOT NULL,
    "jedinica" "Tezina" NOT NULL DEFAULT 'mg',

    CONSTRAINT "Sastojak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Element" (
    "id" SERIAL NOT NULL,
    "element" "Elementi" NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sadnja" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parcelaId" INTEGER NOT NULL,
    "biljkaId" INTEGER NOT NULL,
    "kolicinaPosadjeneKulture" INTEGER NOT NULL,
    "ocekivaniDatumBerbe" TIMESTAMP(3) NOT NULL,
    "prinos" INTEGER NOT NULL DEFAULT 0,
    "jedinica" "Tezina" NOT NULL DEFAULT 'KG',
    "status" "StatusZasadjeneKulture" NOT NULL DEFAULT 'ZASADJENA',

    CONSTRAINT "Sadnja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransakcijaPoena" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "datumTransakcije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ostvareniPoeni" INTEGER NOT NULL,
    "razlog" TEXT NOT NULL,

    CONSTRAINT "TransakcijaPoena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemaForuma" (
    "id" SERIAL NOT NULL,
    "naslov" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "datumKreiranja" TIMESTAMP(3) NOT NULL,
    "datumIzmene" TIMESTAMP(3),
    "farmerId" INTEGER NOT NULL,

    CONSTRAINT "TemaForuma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PorukaForuma" (
    "id" SERIAL NOT NULL,
    "Sadrzaj" TEXT NOT NULL,
    "DatumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DatumIzmene" TIMESTAMP(3),
    "autorId" INTEGER NOT NULL,
    "temaId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "PorukaForuma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Navodnjavanje" (
    "id" SERIAL NOT NULL,
    "datumNavodnjavanja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parcelaId" INTEGER,
    "farmerId" INTEGER NOT NULL,
    "napomena" TEXT NOT NULL,

    CONSTRAINT "Navodnjavanje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReakcijaNaTemu" (
    "id" SERIAL NOT NULL,
    "datumReakcije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idPost" INTEGER NOT NULL,
    "idFarmera" INTEGER NOT NULL,

    CONSTRAINT "ReakcijaNaTemu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReakcijaNaPoruku" (
    "id" SERIAL NOT NULL,
    "datumReakcije" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idFarmera" INTEGER NOT NULL,
    "idMessage" INTEGER NOT NULL,

    CONSTRAINT "ReakcijaNaPoruku_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Poljoprivrednik_email_key" ON "Poljoprivrednik"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Poljoprivrednik_username_key" ON "Poljoprivrednik"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Biljka_vrsta_key" ON "Biljka"("vrsta");

-- CreateIndex
CREATE UNIQUE INDEX "Tretman_parcelaId_biljkaId_preparatId_datumTretmana_key" ON "Tretman"("parcelaId", "biljkaId", "preparatId", "datumTretmana");

-- CreateIndex
CREATE UNIQUE INDEX "Sastojak_preparatId_elementId_key" ON "Sastojak"("preparatId", "elementId");

-- AddForeignKey
ALTER TABLE "Parcela" ADD CONSTRAINT "Parcela_vlasnikId_fkey" FOREIGN KEY ("vlasnikId") REFERENCES "Poljoprivrednik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biljka" ADD CONSTRAINT "Biljka_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "Parcela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tretman" ADD CONSTRAINT "Tretman_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "Parcela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tretman" ADD CONSTRAINT "Tretman_biljkaId_fkey" FOREIGN KEY ("biljkaId") REFERENCES "Biljka"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tretman" ADD CONSTRAINT "Tretman_preparatId_fkey" FOREIGN KEY ("preparatId") REFERENCES "Preparat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sastojak" ADD CONSTRAINT "Sastojak_preparatId_fkey" FOREIGN KEY ("preparatId") REFERENCES "Preparat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sastojak" ADD CONSTRAINT "Sastojak_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sadnja" ADD CONSTRAINT "Sadnja_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Poljoprivrednik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sadnja" ADD CONSTRAINT "Sadnja_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "Parcela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sadnja" ADD CONSTRAINT "Sadnja_biljkaId_fkey" FOREIGN KEY ("biljkaId") REFERENCES "Biljka"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransakcijaPoena" ADD CONSTRAINT "TransakcijaPoena_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Poljoprivrednik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemaForuma" ADD CONSTRAINT "TemaForuma_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Poljoprivrednik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PorukaForuma" ADD CONSTRAINT "PorukaForuma_temaId_fkey" FOREIGN KEY ("temaId") REFERENCES "TemaForuma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PorukaForuma" ADD CONSTRAINT "PorukaForuma_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PorukaForuma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Navodnjavanje" ADD CONSTRAINT "Navodnjavanje_parcelaId_fkey" FOREIGN KEY ("parcelaId") REFERENCES "Parcela"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Navodnjavanje" ADD CONSTRAINT "Navodnjavanje_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Poljoprivrednik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReakcijaNaTemu" ADD CONSTRAINT "ReakcijaNaTemu_idPost_fkey" FOREIGN KEY ("idPost") REFERENCES "TemaForuma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReakcijaNaTemu" ADD CONSTRAINT "ReakcijaNaTemu_idFarmera_fkey" FOREIGN KEY ("idFarmera") REFERENCES "Poljoprivrednik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReakcijaNaPoruku" ADD CONSTRAINT "ReakcijaNaPoruku_idFarmera_fkey" FOREIGN KEY ("idFarmera") REFERENCES "Poljoprivrednik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReakcijaNaPoruku" ADD CONSTRAINT "ReakcijaNaPoruku_idMessage_fkey" FOREIGN KEY ("idMessage") REFERENCES "PorukaForuma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
