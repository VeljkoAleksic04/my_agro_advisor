/*
  Warnings:

  - You are about to drop the column `orezime` on the `Poljoprivrednik` table. All the data in the column will be lost.
  - Added the required column `prezime` to the `Poljoprivrednik` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Poljoprivrednik" DROP COLUMN "orezime",
ADD COLUMN     "prezime" TEXT NOT NULL;
