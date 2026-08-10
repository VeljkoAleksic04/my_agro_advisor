-- AlterTable
ALTER TABLE "poljoprivrednici" ADD COLUMN     "brojTelefona" TEXT,
ADD COLUMN     "slika" TEXT;

-- AlterTable
ALTER TABLE "sadnje" ALTER COLUMN "ocekivaniDatumBerbe" DROP NOT NULL;
