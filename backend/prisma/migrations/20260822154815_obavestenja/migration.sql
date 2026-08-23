-- CreateTable
CREATE TABLE "obavestenja" (
    "id" SERIAL NOT NULL,
    "korisnikId" INTEGER NOT NULL,
    "tip" TEXT NOT NULL,
    "poruka" TEXT NOT NULL,
    "temaId" INTEGER,
    "porukaId" INTEGER,
    "procitano" BOOLEAN NOT NULL DEFAULT false,
    "datumKreiranja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obavestenja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "obavestenja_korisnikId_procitano_idx" ON "obavestenja"("korisnikId", "procitano");

-- CreateIndex
CREATE INDEX "obavestenja_korisnikId_datumKreiranja_idx" ON "obavestenja"("korisnikId", "datumKreiranja");

-- AddForeignKey
ALTER TABLE "obavestenja" ADD CONSTRAINT "obavestenja_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "poljoprivrednici"("id") ON DELETE CASCADE ON UPDATE CASCADE;
