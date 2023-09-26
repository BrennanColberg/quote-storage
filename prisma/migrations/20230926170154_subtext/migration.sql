-- AlterTable
ALTER TABLE "Citation" ADD COLUMN     "subtextId" TEXT,
ALTER COLUMN "sourceId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Subtext" (
    "id" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    "title" TEXT,
    "ordinal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subtext_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subtext" ADD CONSTRAINT "Subtext_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_subtextId_fkey" FOREIGN KEY ("subtextId") REFERENCES "Subtext"("id") ON DELETE CASCADE ON UPDATE CASCADE;
