/*
  Warnings:

  - You are about to drop the column `sourceId` on the `Person` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "yearBorn" TEXT,
    "yearDied" TEXT,
    "textId" TEXT,
    "fictional" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "bio" TEXT,
    CONSTRAINT "Person_textId_fkey" FOREIGN KEY ("textId") REFERENCES "Text" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Person" ("bio", "fictional", "id", "name", "notes", "shortName", "textId", "yearBorn", "yearDied") SELECT "bio", "fictional", "id", "name", "notes", "shortName", "textId", "yearBorn", "yearDied" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
