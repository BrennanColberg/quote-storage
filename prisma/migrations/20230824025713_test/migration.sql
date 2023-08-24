/*
  Warnings:

  - You are about to drop the `_ThingToText` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ThingAuthors" DROP CONSTRAINT "_ThingAuthors_A_fkey";

-- DropForeignKey
ALTER TABLE "_ThingAuthors" DROP CONSTRAINT "_ThingAuthors_B_fkey";

-- DropForeignKey
ALTER TABLE "_ThingEditors" DROP CONSTRAINT "_ThingEditors_A_fkey";

-- DropForeignKey
ALTER TABLE "_ThingEditors" DROP CONSTRAINT "_ThingEditors_B_fkey";

-- DropForeignKey
ALTER TABLE "_ThingToText" DROP CONSTRAINT "_ThingToText_A_fkey";

-- DropForeignKey
ALTER TABLE "_ThingToText" DROP CONSTRAINT "_ThingToText_B_fkey";

-- DropForeignKey
ALTER TABLE "_ThingTranslators" DROP CONSTRAINT "_ThingTranslators_A_fkey";

-- DropForeignKey
ALTER TABLE "_ThingTranslators" DROP CONSTRAINT "_ThingTranslators_B_fkey";

-- DropTable
DROP TABLE "_ThingToText";

-- CreateTable
CREATE TABLE "_TextToThing" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TextToThing_AB_unique" ON "_TextToThing"("A", "B");

-- CreateIndex
CREATE INDEX "_TextToThing_B_index" ON "_TextToThing"("B");

-- AddForeignKey
ALTER TABLE "_ThingAuthors" ADD CONSTRAINT "_ThingAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingAuthors" ADD CONSTRAINT "_ThingAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingTranslators" ADD CONSTRAINT "_ThingTranslators_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingTranslators" ADD CONSTRAINT "_ThingTranslators_B_fkey" FOREIGN KEY ("B") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingEditors" ADD CONSTRAINT "_ThingEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThingEditors" ADD CONSTRAINT "_ThingEditors_B_fkey" FOREIGN KEY ("B") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TextToThing" ADD CONSTRAINT "_TextToThing_A_fkey" FOREIGN KEY ("A") REFERENCES "Text"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TextToThing" ADD CONSTRAINT "_TextToThing_B_fkey" FOREIGN KEY ("B") REFERENCES "Thing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
