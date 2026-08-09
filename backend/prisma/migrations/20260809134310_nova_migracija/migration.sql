/*
  Warnings:

  - Changed the type of `vrsta` on the `biljke` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VrstaBiljke" AS ENUM ('PSENICA', 'KUKURUZ', 'JECAM', 'OVAS', 'RAZ', 'SUNCOKRET', 'SOJA', 'SECERNA_REPA', 'KROMPIR', 'PARADAJZ', 'PAPRIKA', 'KRASTAVAC', 'KUPUS', 'LUK', 'BELI_LUK', 'MRKVA', 'SALATA', 'TIKVICA', 'LUBENICA', 'DINJA');

-- AlterTable
ALTER TABLE "biljke" DROP COLUMN "vrsta",
ADD COLUMN     "vrsta" "VrstaBiljke" NOT NULL;

-- DropEnum
DROP TYPE "SortaPaprike";

-- CreateIndex
CREATE UNIQUE INDEX "biljke_parcelaId_vrsta_key" ON "biljke"("parcelaId", "vrsta");
