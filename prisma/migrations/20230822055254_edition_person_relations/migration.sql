/*
  Warnings:

  - You are about to drop the column `textId` on the `Person` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_PersonToText" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PersonToText_A_fkey" FOREIGN KEY ("A") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PersonToText_B_fkey" FOREIGN KEY ("B") REFERENCES "Text" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EditionAuthors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EditionAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EditionAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EditionTranslators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EditionTranslators_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EditionTranslators_B_fkey" FOREIGN KEY ("B") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EditionEditors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EditionEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "Edition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EditionEditors_B_fkey" FOREIGN KEY ("B") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "yearBorn" TEXT,
    "yearDied" TEXT,
    "fictional" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "bio" TEXT
);
INSERT INTO "new_Person" ("bio", "fictional", "id", "name", "notes", "shortName", "yearBorn", "yearDied") SELECT "bio", "fictional", "id", "name", "notes", "shortName", "yearBorn", "yearDied" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToText_AB_unique" ON "_PersonToText"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToText_B_index" ON "_PersonToText"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionAuthors_AB_unique" ON "_EditionAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionAuthors_B_index" ON "_EditionAuthors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionTranslators_AB_unique" ON "_EditionTranslators"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionTranslators_B_index" ON "_EditionTranslators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EditionEditors_AB_unique" ON "_EditionEditors"("A", "B");

-- CreateIndex
CREATE INDEX "_EditionEditors_B_index" ON "_EditionEditors"("B");
