/*
  Warnings:

  - Added the required column `updatedAt` to the `Citation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Publisher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Source` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Text` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Thing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Citation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Publisher" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Text" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Thing" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
