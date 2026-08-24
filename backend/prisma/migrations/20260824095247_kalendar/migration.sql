-- CreateTable
CREATE TABLE "kalendar_dogadjaji" (
    "id" SERIAL NOT NULL,
    "farmerId" INTEGER NOT NULL,
    "naslov" TEXT NOT NULL,
    "opis" TEXT,
    "datumPocetka" DATE NOT NULL,
    "datumKraja" DATE NOT NULL,
    "kreiranDana" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kalendar_dogadjaji_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "kalendar_dogadjaji_farmerId_datumPocetka_datumKraja_idx" ON "kalendar_dogadjaji"("farmerId", "datumPocetka", "datumKraja");

-- AddForeignKey
ALTER TABLE "kalendar_dogadjaji" ADD CONSTRAINT "kalendar_dogadjaji_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;
