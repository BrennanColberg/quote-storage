/*
  Warnings:

  - You are about to drop the column `link` on the `Thing` table. All the data in the column will be lost.
  - The `type` column on the `Thing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ThingType" AS ENUM ('PAPERBACK', 'HARDCOVER', 'LEATHERBOUND', 'WEBSITE', 'PDF', 'VIDEO_RECORDING', 'AUDIO_RECORDING');

-- AlterTable
ALTER TABLE "Thing" DROP COLUMN "link",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "url" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "ThingType";
