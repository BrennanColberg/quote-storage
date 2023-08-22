/*
  Warnings:

  - You are about to drop the column `city` on the `Publisher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Publisher" DROP COLUMN "city",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT;
